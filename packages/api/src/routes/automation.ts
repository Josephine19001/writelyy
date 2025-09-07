import { Hono } from 'hono';
import { validator } from 'hono-openapi/zod';
import { z } from 'zod';
import { db } from '@repo/database';
import { authMiddleware } from '../middleware/auth';

export const automationRoutes = new Hono()

  // Process scheduled posts (for cron jobs)
  .post(
    '/automation/process-scheduled',
    validator(
      'json',
      z.object({
        maxPosts: z.number().optional().default(10),
        apiKey: z.string().optional()
      })
    ),
    async (c: any) => {
      try {
        const body = await c.req.json().catch(() => ({}));
        const maxPosts = body.maxPosts || 10;
        const apiKey = body.apiKey;

        // Check if request is from Vercel Cron (has special header) or requires API key
        const isVercelCron = c.req
          .header('user-agent')
          ?.includes('vercel-cron');

        if (!isVercelCron && apiKey !== process.env.AUTOMATION_API_KEY) {
          return c.json({ error: 'Invalid API key' }, 401);
        }

        // Find posts that need processing
        const posts = await db.post.findMany({
          where: {
            autoProcess: true,
            OR: [{ nextCheckAt: null }, { nextCheckAt: { lte: new Date() } }],
            retryCount: { lt: 3 }
          } as any,
          select: {
            id: true,
            url: true,
            status: true,
            commentCount: true,
            checkIntervalHours: true
          },
          take: maxPosts,
          orderBy: { createdAt: 'asc' }
        });

        if (posts.length === 0) {
          return c.json({
            success: true,
            processed: 0,
            message: 'No posts due for processing'
          });
        }

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        // Process each post
        for (const post of posts) {
          try {
            // Step 1: Fetch comments if needed
            if (
              post.status === 'PENDING' ||
              !post.commentCount ||
              post.commentCount === 0
            ) {
              const fetchResponse = await fetch(
                `${process.env.API_BASE_URL}/api/posts/${post.id}/fetch-comments`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );

              if (!fetchResponse.ok) {
                throw new Error(
                  `Failed to fetch comments: ${fetchResponse.statusText}`
                );
              }

              // Wait a bit before next step
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            // Step 2: Analyze if we have comments
            const updatedPost = await db.post.findUnique({
              where: { id: post.id },
              select: { commentCount: true }
            });

            if (updatedPost?.commentCount && updatedPost.commentCount > 0) {
              const analyzeResponse = await fetch(
                `${process.env.API_BASE_URL}/api/posts/${post.id}/analyze`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );

              if (!analyzeResponse.ok) {
                throw new Error(
                  `Failed to analyze: ${analyzeResponse.statusText}`
                );
              }
            }

            // Step 3: Schedule next check
            const nextCheck = new Date();
            nextCheck.setHours(nextCheck.getHours() + post.checkIntervalHours);

            await db.post.update({
              where: { id: post.id },
              data: {
                nextCheckAt: nextCheck,
                retryCount: 0,
                lastError: null
              } as any
            });

            successCount++;
            results.push({
              postId: post.id,
              status: 'success',
              url: post.url
            });

            // Add delay between posts
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } catch (error) {
            errorCount++;
            console.error(`❌ Failed to process post ${post.id}:`, error);

            // Handle retry logic
            const retryCount = (post as any).retryCount + 1;
            const maxRetries = 3;

            if (retryCount >= maxRetries) {
              await db.post.update({
                where: { id: post.id },
                data: {
                  lastError:
                    error instanceof Error ? error.message : 'Unknown error',
                  retryCount,
                  nextCheckAt: null
                } as any
              });
            } else {
              const retryDelays = [10, 30, 120]; // 10min, 30min, 2hours
              const delayMinutes = retryDelays[retryCount - 1] || 120;
              const nextRetry = new Date();
              nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);

              await db.post.update({
                where: { id: post.id },
                data: {
                  lastError:
                    error instanceof Error ? error.message : 'Unknown error',
                  retryCount,
                  nextCheckAt: nextRetry
                } as any
              });
            }

            results.push({
              postId: post.id,
              status: 'error',
              url: post.url,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        return c.json({
          success: true,
          processed: posts.length,
          successCount,
          errorCount,
          results
        });
      } catch (error) {
        console.error('❌ Automation processing error:', error);
        return c.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          500
        );
      }
    }
  )

  // Enable automation for a post
  .post(
    '/automation/enable/:postId',
    authMiddleware,
    validator(
      'json',
      z.object({
        checkIntervalHours: z.number().min(1).max(168).optional().default(24)
      })
    ),
    async (c: any) => {
      try {
        const { postId } = c.req.param();
        const { checkIntervalHours } = c.req.valid('json');

        await db.post.update({
          where: { id: postId },
          data: {
            autoProcess: true,
            checkIntervalHours,
            nextCheckAt: new Date(),
            retryCount: 0,
            lastError: null
          } as any
        });

        return c.json({
          success: true,
          message: 'Automation enabled',
          checkIntervalHours
        });
      } catch (error) {
        console.error('❌ Failed to enable automation:', error);
        return c.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          500
        );
      }
    }
  )

  // Disable automation for a post
  .post('/automation/disable/:postId', authMiddleware, async (c: any) => {
    try {
      const { postId } = c.req.param();

      await db.post.update({
        where: { id: postId },
        data: {
          autoProcess: false,
          nextCheckAt: null,
          retryCount: 0,
          lastError: null
        } as any
      });

      return c.json({
        success: true,
        message: 'Automation disabled'
      });
    } catch (error) {
      console.error('❌ Failed to disable automation:', error);
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        500
      );
    }
  })

  // Get automation status for organization
  .get('/automation/status/:organizationId', authMiddleware, async (c: any) => {
    try {
      const { organizationId } = c.req.param();

      const posts = await db.post.findMany({
        where: { organizationId },
        select: {
          id: true,
          url: true,
          caption: true,
          status: true,
          autoProcess: true,
          checkIntervalHours: true,
          nextCheckAt: true,
          retryCount: true,
          lastError: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      const automatedPosts = posts.filter((p) => p.autoProcess);
      const pendingPosts = automatedPosts.filter(
        (p) => !p.nextCheckAt || new Date(p.nextCheckAt) <= new Date()
      );
      const failedPosts = posts.filter((p) => p.retryCount >= 3);

      return c.json({
        success: true,
        stats: {
          totalPosts: posts.length,
          automatedPosts: automatedPosts.length,
          pendingPosts: pendingPosts.length,
          failedPosts: failedPosts.length
        },
        posts: posts.map((post) => ({
          ...post,
          isDue: !post.nextCheckAt || new Date(post.nextCheckAt) <= new Date(),
          hasErrors: post.retryCount >= 3,
          nextCheckAt: post.nextCheckAt
            ? new Date(post.nextCheckAt).toISOString()
            : null
        }))
      });
    } catch (error) {
      console.error('❌ Failed to get automation status:', error);
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        500
      );
    }
  });

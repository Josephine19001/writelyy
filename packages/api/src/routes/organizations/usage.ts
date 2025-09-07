import { Hono } from 'hono';
import { validator } from 'hono-openapi/zod';
import { z } from 'zod';
import { db } from '@repo/database';
import { authMiddleware } from '../../middleware/auth';
import { verifyOrganizationMembership } from './lib/membership';

export const usageRoutes = new Hono()
  // Get usage statistics for an organization
  .get(
    '/:organizationId/usage',
    authMiddleware,
    validator(
      'param',
      z.object({
        organizationId: z.string()
      })
    ),
    validator(
      'query',
      z.object({
        period: z
          .enum(['current-month', 'all-time'])
          .optional()
          .default('all-time')
      })
    ),
    async (c: any) => {
      try {
        const { organizationId } = c.req.valid('param');
        const { period } = c.req.valid('query');
        const user = c.get('user');

        // Verify user has access to this organization
        await verifyOrganizationMembership(organizationId, user.id);

        // Calculate date filter for current month
        let dateFilter: Date | undefined;
        if (period === 'current-month') {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          dateFilter = startOfMonth;
        }

        // Get posts count and total comments for this organization
        const posts = await db.post.findMany({
          where: {
            organizationId,
            ...(dateFilter && {
              createdAt: {
                gte: dateFilter
              }
            })
          },
          select: {
            id: true,
            commentCount: true,
            createdAt: true
          }
        });

        const totalPosts = posts.length;
        const totalComments = posts.reduce(
          (sum, post) => sum + (post.commentCount || 0),
          0
        );

        return c.json({
          posts: totalPosts,
          comments: totalComments,
          period
        });
      } catch (error) {
        console.error('Error fetching usage data:', error);
        return c.json({ error: 'Failed to fetch usage data' }, 500);
      }
    }
  )

  // Get detailed usage breakdown (optional for admin/analytics)
  .get(
    '/:organizationId/usage/detailed',
    authMiddleware,
    validator(
      'param',
      z.object({
        organizationId: z.string()
      })
    ),
    validator(
      'query',
      z.object({
        period: z.enum(['7d', '30d', '90d', 'all']).optional().default('30d')
      })
    ),
    async (c: any) => {
      try {
        const { organizationId } = c.req.valid('param');
        const { period } = c.req.valid('query');
        const user = c.get('user');

        await verifyOrganizationMembership(organizationId, user.id);

        // Calculate date filter based on period
        let dateFilter: Date | undefined;
        if (period !== 'all') {
          const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
          dateFilter = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        }

        const posts = await db.post.findMany({
          where: {
            organizationId,
            ...(dateFilter && {
              createdAt: {
                gte: dateFilter
              }
            })
          },
          select: {
            id: true,
            platform: true,
            commentCount: true,
            createdAt: true,
            status: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        // Group by platform
        const byPlatform = posts.reduce(
          (acc, post) => {
            const platform = post.platform || 'UNKNOWN';
            if (!acc[platform]) {
              acc[platform] = { posts: 0, comments: 0 };
            }
            acc[platform].posts += 1;
            acc[platform].comments += post.commentCount || 0;
            return acc;
          },
          {} as Record<string, { posts: number; comments: number }>
        );

        // Group by status
        const byStatus = posts.reduce(
          (acc, post) => {
            const status = post.status || 'UNKNOWN';
            if (!acc[status]) {
              acc[status] = { posts: 0, comments: 0 };
            }
            acc[status].posts += 1;
            acc[status].comments += post.commentCount || 0;
            return acc;
          },
          {} as Record<string, { posts: number; comments: number }>
        );

        return c.json({
          summary: {
            posts: posts.length,
            comments: posts.reduce(
              (sum, post) => sum + (post.commentCount || 0),
              0
            ),
            period
          },
          byPlatform,
          byStatus,
          recentPosts: posts.slice(0, 10).map((post) => ({
            id: post.id,
            platform: post.platform,
            commentCount: post.commentCount,
            createdAt: post.createdAt,
            status: post.status
          }))
        });
      } catch (error) {
        console.error('Error fetching detailed usage data:', error);
        return c.json({ error: 'Failed to fetch detailed usage data' }, 500);
      }
    }
  );

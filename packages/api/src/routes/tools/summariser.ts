import { generateText } from '../../lib/ai-client';
import { encryptData, decryptData } from '@repo/database/lib/encryption';
import { createSummariserUsage, getSummariserUsageByUserId, deleteSummariserUsage } from '@repo/database';
import { SummariserInputSchema, preprocessInput } from '../../lib/input-validation';
import { validateAndEnforceLimit } from '../../lib/word-limit-middleware';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { authMiddleware } from '../../middleware/auth';
import { buildSummariserPrompt } from '../../lib/prompt-templates';


const SummarizeResponseSchema = z.object({
  summaryText: z.string(),
  wordCount: z.number(),
  charactersUsed: z.number(),
  creditsUsed: z.number().optional(),
  reductionPercentage: z.number()
});

export const summariserRouter = new Hono()
  .basePath('/tools/summariser')
  .use(authMiddleware)
  .post(
    '/process',
    describeRoute({
      tags: ['Tools'],
      summary: 'Summarize text content',
      description: 'Generate concise summaries of long text content',
      responses: {
        200: {
          description: 'Text summary',
          content: {
            'application/json': {
              schema: resolver(SummarizeResponseSchema)
            }
          }
        }
      }
    }),
    validator('json', SummariserInputSchema),
    async (c) => {
      const { inputText, summaryType } = c.req.valid('json');
      const user = c.get('user');

      // Validate input and check word limits
      const validation = await validateAndEnforceLimit(user.id, inputText, 'summariser');
      
      if (!validation.success) {
        throw new HTTPException(400, { 
          message: validation.message,
          cause: validation.error 
        });
      }
      
      // Preprocess and validate input
      const { cleanText, wordCount, characterCount, creditsRequired } = preprocessInput(inputText);

      const prompt = buildSummariserPrompt(cleanText, summaryType);

      try {
        // Call AI model to summarize the text
        const response = await generateText({
          prompt,
          maxTokens: Math.min(1000, Math.floor(inputText.length * 0.3))
        });

        const summaryText = response.text;
        const summaryWordCount = summaryText.split(/\s+/).length;
        const reductionPercentage = Math.round((1 - summaryWordCount / wordCount) * 100);

        // Encrypt sensitive content before storing
        const encryptedContent = encryptData(JSON.stringify({
          inputText: cleanText,
          summaryText
        }));

        // Save usage to database
        await createSummariserUsage({
          user: { connect: { id: user.id } },
          encryptedContent: JSON.stringify(encryptedContent),
          summaryType,
          wordCount,
          charactersUsed: characterCount,
          creditsUsed: creditsRequired,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        return c.json({
          summaryText,
          wordCount,
          charactersUsed: characterCount,
          creditsUsed: creditsRequired,
          reductionPercentage
        });
      } catch (error) {
        console.error('Summariser error:', error);
        throw new HTTPException(500, { message: 'Failed to process text' });
      }
    }
  )
  .get(
    '/history',
    describeRoute({
      tags: ['Tools'],
      summary: 'Get summariser usage history',
      description: 'Retrieve recent summariser usage for the current user',
      responses: {
        200: {
          description: 'Usage history',
          content: {
            'application/json': {
              schema: resolver(z.object({
                history: z.array(z.object({
                  id: z.string(),
                  summaryType: z.string().nullable(),
                  wordCount: z.number(),
                  charactersUsed: z.number(),
                  creditsUsed: z.number().nullable(),
                  createdAt: z.date(),
                  inputText: z.string(),
                  summaryText: z.string()
                }))
              }))
            }
          }
        }
      }
    }),
    validator('query', z.object({
      limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional().default('10')
    }).optional()),
    async (c) => {
      const query = c.req.valid('query');
      const user = c.get('user');
      const limit = query?.limit || 10;

      const usageRecords = await getSummariserUsageByUserId({
        userId: user.id,
        limit
      });

      const history = usageRecords.map(record => {
        // Decrypt content
        const encryptedData = JSON.parse(record.encryptedContent);
        const decryptedContent = JSON.parse(decryptData(encryptedData));
        
        return {
          id: record.id,
          summaryType: record.summaryType,
          wordCount: record.wordCount,
          charactersUsed: record.charactersUsed,
          creditsUsed: record.creditsUsed,
          createdAt: record.createdAt,
          inputText: decryptedContent.inputText,
          summaryText: decryptedContent.summaryText
        };
      });

      return c.json({ history });
    }
  )
  .delete(
    '/history/:id',
    describeRoute({
      tags: ['Tools'],
      summary: 'Delete summariser history item',
      description: 'Delete a specific summariser history entry by ID',
      responses: {
        204: {
          description: 'History item deleted successfully'
        },
        404: {
          description: 'History item not found'
        }
      }
    }),
    async (c) => {
      const { id } = c.req.param();
      const user = c.get('user');

      const result = await deleteSummariserUsage(id, user.id);
      
      if (result.count === 0) {
        throw new HTTPException(404, { message: 'History item not found' });
      }

      return c.body(null, 204);
    }
  );
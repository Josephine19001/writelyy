import { generateText } from '../../lib/ai-client';
import { encryptData, decryptData } from '@repo/database/lib/encryption';
import { createHumanizerUsage, getHumanizerUsageByUserId } from '@repo/database';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { authMiddleware } from '../../middleware/auth';
import { buildHumanizerPrompt } from '../../lib/prompt-templates';
import { HumanizerInputSchema, preprocessInput } from '../../lib/input-validation';
import { validateAndEnforceLimit } from '../../lib/word-limit-middleware';

const HumanizeResponseSchema = z.object({
  outputText: z.string(),
  wordCount: z.number(),
  charactersUsed: z.number(),
  creditsUsed: z.number().optional()
});

export const humanizerRouter = new Hono()
  .basePath('/tools/humanizer')
  .use(authMiddleware)
  .post(
    '/process',
    describeRoute({
      tags: ['Tools'],
      summary: 'Humanize AI text',
      description: 'Transform AI-generated text into natural, human-like writing',
      responses: {
        200: {
          description: 'Humanized text',
          content: {
            'application/json': {
              schema: resolver(HumanizeResponseSchema)
            }
          }
        }
      }
    }),
    validator('json', HumanizerInputSchema),
    async (c) => {
      const { inputText, tone } = c.req.valid('json');
      const user = c.get('user');

      // Validate input and check word limits
      const validation = await validateAndEnforceLimit(user.id, inputText, 'humanizer');
      
      if (!validation.success) {
        throw new HTTPException(400, { 
          message: validation.message,
          cause: validation.error 
        });
      }
      
      // Preprocess and validate input
      const { cleanText, wordCount, characterCount, creditsRequired } = preprocessInput(inputText);

      const prompt = buildHumanizerPrompt(cleanText, tone);

      try {
        // Call AI model to humanize the text
        const response = await generateText({
          prompt,
          maxTokens: Math.min(2000, inputText.length * 2)
        });

        const outputText = response.text;

        // Encrypt sensitive content before storing
        const encryptedContent = encryptData(JSON.stringify({
          inputText: cleanText,
          outputText
        }));

        // Save usage to database
        await createHumanizerUsage({
          user: { connect: { id: user.id } },
          encryptedContent: JSON.stringify(encryptedContent),
          tone,
          wordCount,
          charactersUsed: characterCount,
          creditsUsed: creditsRequired,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        return c.json({
          outputText,
          wordCount,
          charactersUsed: characterCount,
          creditsUsed: creditsRequired
        });
      } catch (error) {
        console.error('Humanizer error:', error);
        throw new HTTPException(500, { message: 'Failed to process text' });
      }
    }
  )
  .get(
    '/history',
    describeRoute({
      tags: ['Tools'],
      summary: 'Get humanizer usage history',
      description: 'Retrieve recent humanizer usage for the current user',
      responses: {
        200: {
          description: 'Usage history',
          content: {
            'application/json': {
              schema: resolver(z.object({
                history: z.array(z.object({
                  id: z.string(),
                  tone: z.string().nullable(),
                  wordCount: z.number(),
                  charactersUsed: z.number(),
                  creditsUsed: z.number().nullable(),
                  createdAt: z.date(),
                  inputText: z.string(),
                  outputText: z.string()
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

      const usageRecords = await getHumanizerUsageByUserId({
        userId: user.id,
        limit
      });

      const history = usageRecords.map(record => {
        // Decrypt content
        const encryptedData = JSON.parse(record.encryptedContent);
        const decryptedContent = JSON.parse(decryptData(encryptedData));
        
        return {
          id: record.id,
          tone: record.tone,
          wordCount: record.wordCount,
          charactersUsed: record.charactersUsed,
          creditsUsed: record.creditsUsed,
          createdAt: record.createdAt,
          inputText: decryptedContent.inputText,
          outputText: decryptedContent.outputText
        };
      });

      return c.json({ history });
    }
  );
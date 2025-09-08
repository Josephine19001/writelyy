import { generateText } from '../../lib/ai-client';
import { encryptData, decryptData } from '@repo/database/lib/encryption';
import { createParaphraserUsage, getParaphraserUsageByUserId } from '@repo/database';
import { ParaphraserInputSchema, preprocessInput } from '../../lib/input-validation';
import { validateAndEnforceLimit } from '../../lib/word-limit-middleware';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { authMiddleware } from '../../middleware/auth';
import { buildParaphraserPrompt } from '../../lib/prompt-templates';


const ParaphraseResponseSchema = z.object({
  paraphrasedText: z.string(),
  wordCount: z.number(),
  charactersUsed: z.number(),
  creditsUsed: z.number().optional()
});

export const paraphraserRouter = new Hono()
  .basePath('/tools/paraphraser')
  .use(authMiddleware)
  .post(
    '/process',
    describeRoute({
      tags: ['Tools'],
      summary: 'Paraphrase text content',
      description: 'Rewrite text with different wording while preserving meaning',
      responses: {
        200: {
          description: 'Paraphrased text',
          content: {
            'application/json': {
              schema: resolver(ParaphraseResponseSchema)
            }
          }
        }
      }
    }),
    validator('json', ParaphraserInputSchema),
    async (c) => {
      const { inputText, style } = c.req.valid('json');
      const user = c.get('user');

      // Validate input and check word limits
      const validation = await validateAndEnforceLimit(user.id, inputText, 'paraphraser');
      
      if (!validation.success) {
        throw new HTTPException(400, { 
          message: validation.message,
          cause: validation.error 
        });
      }
      
      // Preprocess and validate input
      const { cleanText, wordCount, characterCount, creditsRequired } = preprocessInput(inputText);

      const prompt = buildParaphraserPrompt(cleanText, style);

      try {
        // Call AI model to paraphrase the text
        const response = await generateText({
          prompt,
          maxTokens: Math.min(2000, inputText.length * 2)
        });

        const paraphrasedText = response.text;

        // Encrypt sensitive content before storing
        const encryptedContent = encryptData(JSON.stringify({
          inputText: cleanText,
          paraphrasedText
        }));

        // Save usage to database
        await createParaphraserUsage({
          user: { connect: { id: user.id } },
          encryptedContent: JSON.stringify(encryptedContent),
          style,
          wordCount,
          charactersUsed: characterCount,
          creditsUsed: creditsRequired,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        return c.json({
          paraphrasedText,
          wordCount,
          charactersUsed: characterCount,
          creditsUsed: creditsRequired
        });
      } catch (error) {
        console.error('Paraphraser error:', error);
        throw new HTTPException(500, { message: 'Failed to process text' });
      }
    }
  )
  .get(
    '/history',
    describeRoute({
      tags: ['Tools'],
      summary: 'Get paraphraser usage history',
      description: 'Retrieve recent paraphraser usage for the current user',
      responses: {
        200: {
          description: 'Usage history',
          content: {
            'application/json': {
              schema: resolver(z.object({
                history: z.array(z.object({
                  id: z.string(),
                  style: z.string().nullable(),
                  wordCount: z.number(),
                  charactersUsed: z.number(),
                  creditsUsed: z.number().nullable(),
                  createdAt: z.date(),
                  inputText: z.string(),
                  paraphrasedText: z.string()
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

      const usageRecords = await getParaphraserUsageByUserId({
        userId: user.id,
        limit
      });

      const history = usageRecords.map(record => {
        // Decrypt content
        const encryptedData = JSON.parse(record.encryptedContent);
        const decryptedContent = JSON.parse(decryptData(encryptedData));
        
        return {
          id: record.id,
          style: record.style,
          wordCount: record.wordCount,
          charactersUsed: record.charactersUsed,
          creditsUsed: record.creditsUsed,
          createdAt: record.createdAt,
          inputText: decryptedContent.inputText,
          paraphrasedText: decryptedContent.paraphrasedText
        };
      });

      return c.json({ history });
    }
  );
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/zod';
import { z } from 'zod';
import { checkAIHealth } from '../../lib/ai-client';

const HealthResponseSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'down']),
  services: z.object({
    openai: z.boolean(),
    groq: z.boolean()
  }),
  timestamp: z.string()
});

export const healthRouter = new Hono()
  .basePath('/tools/health')
  .get(
    '/',
    describeRoute({
      tags: ['Tools'],
      summary: 'Check AI services health',
      description: 'Check the availability of OpenAI and Groq services',
      responses: {
        200: {
          description: 'Health status',
          content: {
            'application/json': {
              schema: resolver(HealthResponseSchema)
            }
          }
        }
      }
    }),
    async (c) => {
      const services = await checkAIHealth();
      
      let status: 'healthy' | 'degraded' | 'down';
      if (services.openai && services.groq) {
        status = 'healthy';
      } else if (services.openai || services.groq) {
        status = 'degraded';
      } else {
        status = 'down';
      }

      return c.json({
        status,
        services,
        timestamp: new Date().toISOString()
      });
    }
  );
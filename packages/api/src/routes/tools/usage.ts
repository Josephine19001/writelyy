import { getUserMonthlyStats } from '@repo/database/prisma/queries/tools';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { authMiddleware } from '../../middleware/auth';

const MonthlyUsageStatsSchema = z.object({
  currentUsage: z.number(),
  wordLimit: z.number(),
  remainingWords: z.number(),
  usagePercentage: z.number(),
  breakdown: z.object({
    humanizer: z.number(),
    detector: z.number(),
    summariser: z.number(),
    paraphraser: z.number(),
  }),
  month: z.number(),
  year: z.number(),
});

export const usageRouter = new Hono()
  .basePath('/tools/usage')
  .use(authMiddleware)
  .get(
    '/monthly',
    describeRoute({
      tags: ['Tools'],
      summary: 'Get monthly usage statistics',
      description: 'Retrieve current month usage stats including word limits and breakdowns',
      responses: {
        200: {
          description: 'Monthly usage statistics',
          content: {
            'application/json': {
              schema: resolver(MonthlyUsageStatsSchema)
            }
          }
        }
      }
    }),
    async (c) => {
      const user = c.get('user');

      try {
        const stats = await getUserMonthlyStats(user.id);
        return c.json(stats);
      } catch (error) {
        console.error('Usage stats error:', error);
        throw new HTTPException(500, { message: 'Failed to fetch usage statistics' });
      }
    }
  )
  .get(
    '/monthly/:month/:year',
    describeRoute({
      tags: ['Tools'],
      summary: 'Get usage statistics for specific month',
      description: 'Retrieve usage stats for a specific month and year',
      responses: {
        200: {
          description: 'Monthly usage statistics',
          content: {
            'application/json': {
              schema: resolver(MonthlyUsageStatsSchema)
            }
          }
        }
      }
    }),
    validator('param', z.object({
      month: z.string().transform(Number).pipe(z.number().min(1).max(12)),
      year: z.string().transform(Number).pipe(z.number().min(2020).max(2030))
    })),
    async (c) => {
      const user = c.get('user');
      const { month, year } = c.req.valid('param');

      try {
        const stats = await getUserMonthlyStats(user.id);
        // Note: This would need to be extended to support historical data
        // For now, only return current month stats
        if (month === stats.month && year === stats.year) {
          return c.json(stats);
        } else {
          // Return empty stats for historical months (could be enhanced later)
          return c.json({
            currentUsage: 0,
            wordLimit: stats.wordLimit,
            remainingWords: stats.wordLimit,
            usagePercentage: 0,
            breakdown: {
              humanizer: 0,
              detector: 0,
              summariser: 0,
              paraphraser: 0,
            },
            month,
            year,
          });
        }
      } catch (error) {
        console.error('Usage stats error:', error);
        throw new HTTPException(500, { message: 'Failed to fetch usage statistics' });
      }
    }
  );
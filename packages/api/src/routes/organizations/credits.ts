import { Hono } from 'hono';
import { validator } from 'hono-openapi/zod';
import { z } from 'zod';
import {
  getOrganizationCreditBalance,
  getCreditTransactionHistory
} from '@repo/database';
import { authMiddleware } from '../../middleware/auth';
import { verifyOrganizationMembership } from './lib/membership';

export const creditsRoutes = new Hono()
  // Get credit balance for an organization
  .get(
    '/:organizationId/credits',
    authMiddleware,
    validator(
      'param',
      z.object({
        organizationId: z.string()
      })
    ),
    async (c: any) => {
      try {
        const { organizationId } = c.req.valid('param');
        const user = c.get('user');

        // Verify user has access to this organization
        await verifyOrganizationMembership(organizationId, user.id);

        // Get credit balance
        const creditData = await getOrganizationCreditBalance(organizationId);

        if (!creditData) {
          return c.json({ error: 'Organization not found' }, 404);
        }

        return c.json({
          creditBalance: creditData.creditBalance,
          lastCreditReset: creditData.lastCreditReset,
          nextCreditReset: creditData.nextCreditReset
        });
      } catch (error) {
        console.error('Error fetching credit balance:', error);
        return c.json({ error: 'Failed to fetch credit balance' }, 500);
      }
    }
  )

  // Get credit transaction history for an organization
  .get(
    '/:organizationId/credits/history',
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
        limit: z.coerce.number().min(1).max(100).optional().default(50),
        offset: z.coerce.number().min(0).optional().default(0)
      })
    ),
    async (c: any) => {
      try {
        const { organizationId } = c.req.valid('param');
        const { limit, offset } = c.req.valid('query');
        const user = c.get('user');

        // Verify user has access to this organization
        await verifyOrganizationMembership(organizationId, user.id);

        // Get transaction history
        const transactions = await getCreditTransactionHistory(
          organizationId,
          limit,
          offset
        );

        return c.json({
          transactions,
          hasMore: transactions.length === limit
        });
      } catch (error) {
        console.error('Error fetching credit history:', error);
        return c.json({ error: 'Failed to fetch credit history' }, 500);
      }
    }
  );

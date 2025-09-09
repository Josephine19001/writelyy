import { type Config, config } from '@repo/config';
import { PurchaseSchema, getPurchaseById } from '@repo/database';
import { logger } from '@repo/logs';
import {
  createCheckoutLink,
  createCustomerPortalLink,
  getCustomerIdFromEntity
} from '@repo/payments';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator } from 'hono-openapi/zod';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { authMiddleware } from '../../middleware/auth';
import { getPurchases } from './lib/purchases';

const plans = config.payments.plans as Config['payments']['plans'];

export const paymentsRouter = new Hono()
  .basePath('/payments')
  .get(
    '/purchases',
    authMiddleware,
    validator(
      'query',
      z.object({
        organizationId: z.string().optional()
      })
    ),
    describeRoute({
      tags: ['Payments'],
      summary: 'Get purchases',
      description:
        'Get all purchases of the current user or the provided organization',
      responses: {
        200: {
          description: 'Purchases',
          content: {
            'application/json': {
              schema: resolver(z.array(PurchaseSchema))
            }
          }
        }
      }
    }),
    async (c) => {
      const { organizationId } = c.req.valid('query');
      const user = c.get('user');

      const purchases = await getPurchases(
        organizationId
          ? {
              organizationId
            }
          : { userId: user.id }
      );

      return c.json(purchases);
    }
  )
  .post(
    '/create-checkout-link',
    authMiddleware,
    validator(
      'query',
      z.object({
        type: z.enum(['one-time', 'subscription']),
        productId: z.string(),
        redirectUrl: z.string().optional()
      })
    ),
    describeRoute({
      tags: ['Payments'],
      summary: 'Create a checkout link',
      description:
        'Creates a checkout link for a one-time or subscription product',
      responses: {
        200: {
          description: 'Checkout link'
        }
      }
    }),
    async (c) => {
      const { productId, redirectUrl, type } = c.req.valid('query');
      const user = c.get('user');

      const customerId = await getCustomerIdFromEntity({
        userId: user.id
      });

      const plan = Object.entries(plans).find(([_planId, plan]) =>
        plan.prices?.find((price) => price.productId === productId)
      );
      const price = plan?.[1].prices?.find(
        (price) => price.productId === productId
      );
      const trialPeriodDays =
        price && 'trialPeriodDays' in price ? price.trialPeriodDays : undefined;

      try {
        const checkoutLink = await createCheckoutLink({
          type,
          productId,
          email: user.email,
          name: user.name ?? '',
          redirectUrl,
          userId: user.id,
          trialPeriodDays,
          customerId: customerId ?? undefined
        });

        if (!checkoutLink) {
          logger.error('Checkout link creation returned null/undefined');
          throw new HTTPException(500, {
            message: 'Failed to create checkout link - no URL returned'
          });
        }

        return c.json({ checkoutLink });
      } catch (e) {
        logger.error('Checkout link creation failed:', e);

        // Provide more specific error message
        const errorMessage =
          e instanceof Error
            ? e.message
            : 'Unknown error creating checkout link';
        throw new HTTPException(500, { message: errorMessage });
      }
    }
  )

  .post(
    '/create-customer-portal-link',
    authMiddleware,
    validator(
      'query',
      z.object({
        purchaseId: z.string(),
        redirectUrl: z.string().optional()
      })
    ),
    describeRoute({
      tags: ['Payments'],
      summary: 'Create a customer portal link',
      description:
        'Creates a customer portal link for the customer or team. If a purchase is provided, the link will be created for the customer of the purchase.',
      responses: {
        200: {
          description: 'Customer portal link'
        }
      }
    }),
    async (c) => {
      const { purchaseId, redirectUrl } = c.req.valid('query');
      const user = c.get('user');

      const purchase = await getPurchaseById(purchaseId);

      if (!purchase) {
        throw new HTTPException(403);
      }

      // For user-level billing, just check if this purchase belongs to the current user
      if (purchase.userId !== user.id) {
        throw new HTTPException(403);
      }

      try {
        const customerPortalLink = await createCustomerPortalLink({
          subscriptionId: purchase.subscriptionId ?? undefined,
          customerId: purchase.customerId,
          redirectUrl
        });

        if (!customerPortalLink) {
          logger.error('Customer portal link creation returned null/undefined');
          throw new HTTPException(500, { message: 'Failed to create customer portal link - no URL returned' });
        }

        return c.json({ customerPortalLink });
      } catch (e) {
        logger.error('Could not create customer portal link:', e);
        
        // Provide more specific error message
        const errorMessage = e instanceof Error ? e.message : 'Unknown error creating customer portal link';
        throw new HTTPException(500, { message: errorMessage });
      }
    }
  );

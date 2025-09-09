import {
  createPurchase,
  deletePurchaseBySubscriptionId,
  getPurchaseBySubscriptionId,
  updatePurchase,
  updateUserWordLimit
} from '@repo/database';
import { logger } from '@repo/logs';
import { config } from '@repo/config';
import Stripe from 'stripe';
import { setCustomerIdToEntity } from '../../src/lib/customer';
import type {
  CancelSubscription,
  CreateCheckoutLink,
  CreateCustomerPortalLink,
  SetSubscriptionSeats,
  WebhookHandler
} from '../../types';

let stripeClient: Stripe | null = null;

function getPlanIdFromProductId(productId: string): string | null {
  const plans = config.payments.plans;
  for (const [planId, planConfig] of Object.entries(plans)) {
    if (planConfig.prices?.some((price) => price.productId === productId)) {
      return planId;
    }
  }
  return null;
}

function getMonthlyWordLimit(planId?: string): number {
  switch (planId) {
    case 'starter':
      return 15000;
    case 'pro':
      return 60000;
    case 'max':
    case 'premium':
      return 150000;
    case 'credits':
      return 60000;
    default:
      return 1000;
  }
}

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

  if (!stripeSecretKey) {
    throw new Error('Missing env variable STRIPE_SECRET_KEY');
  }

  stripeClient = new Stripe(stripeSecretKey);

  return stripeClient;
}

export const createCheckoutLink: CreateCheckoutLink = async (options) => {
  const stripeClient = getStripeClient();
  const {
    type,
    productId,
    redirectUrl,
    customerId,
    userId,
    trialPeriodDays,
    seats,
    email
  } = options;

  if (!productId) {
    throw new Error('Missing productId for checkout session');
  }

  if (!email && !customerId) {
    throw new Error('Either email or customerId must be provided');
  }

  const successUrl =
    redirectUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const metadata = {
    user_id: userId || null
  };

  const response = await stripeClient.checkout.sessions.create({
    mode: type === 'subscription' ? 'subscription' : 'payment',
    success_url: successUrl,
    cancel_url: successUrl, // Add cancel URL
    line_items: [
      {
        quantity: seats ?? 1,
        price: productId
      }
    ],
    // Only pass customer OR customer_email, not both
    ...(customerId ? { customer: customerId } : { customer_email: email }),
    ...(type === 'one-time'
      ? {
          payment_intent_data: {
            metadata
          },
          customer_creation: 'always'
        }
      : {
          subscription_data: {
            metadata,
            trial_period_days: trialPeriodDays
          }
        }),
    metadata
  });

  if (!response.url) {
    throw new Error('Stripe returned no checkout URL');
  }

  return response.url;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async ({
  customerId,
  redirectUrl
}) => {
  const stripeClient = getStripeClient();

  if (!customerId) {
    throw new Error('Missing customerId for customer portal creation');
  }

  const response = await stripeClient.billingPortal.sessions.create({
    customer: customerId,
    return_url: redirectUrl || 'http://localhost:3000'
  });

  if (!response.url) {
    throw new Error('Stripe returned no customer portal URL');
  }

  return response.url;
};

export const setSubscriptionSeats: SetSubscriptionSeats = async ({
  id,
  seats
}) => {
  const stripeClient = getStripeClient();

  const subscription = await stripeClient.subscriptions.retrieve(id);

  if (!subscription) {
    throw new Error('Subscription not found.');
  }

  await stripeClient.subscriptions.update(id, {
    items: [
      {
        id: subscription.items.data[0].id,
        quantity: seats
      }
    ]
  });
};

export const cancelSubscription: CancelSubscription = async (id) => {
  const stripeClient = getStripeClient();

  await stripeClient.subscriptions.cancel(id);
};

export const webhookHandler: WebhookHandler = async (req) => {
  const stripeClient = getStripeClient();

  if (!req.body) {
    return new Response('Invalid request.', {
      status: 400
    });
  }

  let event: Stripe.Event | undefined;

  try {
    event = await stripeClient.webhooks.constructEventAsync(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (e) {
    logger.error(e);

    return new Response('Invalid request.', {
      status: 400
    });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const { mode, metadata, customer, id } = event.data.object;

        logger.info(`💳 Processing checkout.session.completed - mode: ${mode}`);

        const checkoutSession = await stripeClient.checkout.sessions.retrieve(
          id,
          {
            expand: ['line_items']
          }
        );

        const productId = checkoutSession.line_items?.data[0].price?.id;

        if (!productId) {
          logger.error('❌ Missing product ID in checkout session');
          return new Response('Missing product ID.', {
            status: 400
          });
        }

        // Only handle one-time purchases here to avoid duplicates
        if (mode === 'payment') {
          const purchaseData = {
            organizationId: null, // Always null for user-level billing
            userId: metadata?.user_id || null,
            customerId: customer as string,
            type: 'ONE_TIME' as const,
            productId
          };

          logger.info('💾 Creating one-time purchase:', purchaseData);

          const purchase = await createPurchase(purchaseData);

          // Update user's monthly word limit for one-time purchase
          if (purchaseData.userId && purchase) {
            const planId = getPlanIdFromProductId(productId);
            const newWordLimit = getMonthlyWordLimit(planId || undefined);

            try {
              await updateUserWordLimit(purchaseData.userId, newWordLimit);
              logger.info(
                `📝 Updated word limit: ${newWordLimit} words for user ${purchaseData.userId} (one-time plan: ${planId})`
              );
            } catch (error) {
              logger.error(
                '❌ Failed to update user word limit for one-time purchase:',
                error
              );
            }
          }

          // Credits not used in user-level billing
          logger.info(
            '✅ One-time purchase processed successfully (user-level billing)'
          );

          await setCustomerIdToEntity(customer as string, {
            userId: metadata?.user_id
          });

          logger.info('✅ One-time purchase processed successfully');
        }

        // For subscriptions, just log - actual processing happens in customer.subscription.created
        if (mode === 'subscription') {
          logger.info(
            '🔄 Subscription checkout completed - will be processed in subscription.created'
          );
        }

        break;
      }

      case 'customer.subscription.created': {
        const { metadata, customer, items, id, status } = event.data.object;

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        logger.info(`🔄 Processing subscription creation: ${id}`);

        const productId = items?.data[0].price?.id;

        if (!productId) {
          logger.error('❌ Missing product ID in subscription');
          return new Response('Missing product ID.', {
            status: 400
          });
        }

        const purchase = await createPurchase({
          subscriptionId: id,
          organizationId: null, // Always null for user-level billing
          userId: metadata?.user_id || null,
          customerId: customer as string,
          type: 'SUBSCRIPTION',
          productId,
          status
        });

        // Update user's monthly word limit based on their plan
        if (metadata?.user_id && purchase) {
          const planId = getPlanIdFromProductId(productId);
          const newWordLimit = getMonthlyWordLimit(planId || undefined);

          try {
            await updateUserWordLimit(metadata.user_id, newWordLimit);
            logger.info(
              `📝 Updated word limit: ${newWordLimit} words for user ${metadata.user_id} (plan: ${planId})`
            );
          } catch (error) {
            logger.error('❌ Failed to update user word limit:', error);
          }
        }

        // Credits not used in user-level billing - user word limits are set above

        await setCustomerIdToEntity(customer as string, {
          userId: metadata?.user_id
        });

        logger.info('✅ Subscription created and processed successfully');
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        // Handle recurring subscription renewals (skip initial invoice)
        if (invoice.billing_reason === 'subscription_cycle') {
          logger.info(
            `🔄 Processing subscription renewal for invoice ${invoice.id}`
          );

          const subscriptionId = (invoice as any).subscription;

          if (!subscriptionId) {
            logger.error('❌ No subscription ID found in invoice');
            break;
          }

          // For user-level billing, renewals don't need special handling
          // Word limits are already set and usage resets automatically each month
          logger.info(
            `🔄 Subscription renewal processed for ${subscriptionId}`
          );
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscriptionId = event.data.object.id;
        const newProductId = event.data.object.items?.data[0].price?.id;

        const existingPurchase =
          await getPurchaseBySubscriptionId(subscriptionId);

        if (existingPurchase) {
          await updatePurchase({
            id: existingPurchase.id,
            status: event.data.object.status,
            productId: newProductId
          });

          // Update user's word limit if product changed
          if (
            existingPurchase.userId &&
            newProductId &&
            newProductId !== existingPurchase.productId
          ) {
            const planId = getPlanIdFromProductId(newProductId);
            const newWordLimit = getMonthlyWordLimit(planId || undefined);

            try {
              await updateUserWordLimit(existingPurchase.userId, newWordLimit);
              logger.info(
                `📝 Updated word limit on plan change: ${newWordLimit} words for user ${existingPurchase.userId} (plan: ${planId})`
              );
            } catch (error) {
              logger.error(
                '❌ Failed to update user word limit on subscription update:',
                error
              );
            }
          }
        }

        break;
      }
      case 'customer.subscription.deleted': {
        const subscriptionId = event.data.object.id;
        const existingPurchase =
          await getPurchaseBySubscriptionId(subscriptionId);

        // Reset user to free plan word limit before deleting purchase
        if (existingPurchase?.userId) {
          const freeWordLimit = getMonthlyWordLimit(); // defaults to free plan

          try {
            await updateUserWordLimit(existingPurchase.userId, freeWordLimit);
            logger.info(
              `📝 Reset to free word limit: ${freeWordLimit} words for user ${existingPurchase.userId} (subscription cancelled)`
            );
          } catch (error) {
            logger.error(
              '❌ Failed to reset user word limit on subscription cancellation:',
              error
            );
          }
        }

        await deletePurchaseBySubscriptionId(subscriptionId);

        break;
      }

      default:
        return new Response('Unhandled event type.', {
          status: 200
        });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    logger.error('❌ Webhook processing error:', error);
    return new Response('Webhook processing failed.', {
      status: 500
    });
  }
};

// Credits function removed - not used in user-level billing

import {
  createPurchase,
  deletePurchaseBySubscriptionId,
  getPurchaseBySubscriptionId,
  updatePurchase,
  addCreditsToOrganization,
  resetMonthlyCredits
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
    organizationId,
    userId,
    trialPeriodDays,
    seats,
    email
  } = options;

  const metadata = {
    organization_id: organizationId || null,
    user_id: userId || null
  };

  const response = await stripeClient.checkout.sessions.create({
    mode: type === 'subscription' ? 'subscription' : 'payment',
    success_url: redirectUrl ?? '',
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

  return response.url;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async ({
  customerId,
  redirectUrl
}) => {
  const stripeClient = getStripeClient();

  const response = await stripeClient.billingPortal.sessions.create({
    customer: customerId,
    return_url: redirectUrl ?? ''
  });

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
            organizationId: metadata?.organization_id || null,
            userId: metadata?.user_id || null,
            customerId: customer as string,
            type: 'ONE_TIME' as const,
            productId
          };

          logger.info('💾 Creating one-time purchase:', purchaseData);

          const purchase = await createPurchase(purchaseData);

          // Add credits for one-time purchase
          if (purchaseData.organizationId && purchase) {
            const credits = getCreditsByProductId(productId);
            if (credits > 0) {
              await addCreditsToOrganization(
                purchaseData.organizationId,
                credits,
                'PURCHASE_ONETIME',
                `One-time purchase: ${credits} credits`,
                purchase.id
              );
              logger.info(
                `➕ Added one-time credits: ${credits} for organization ${purchaseData.organizationId}`
              );
            }
          }

          await setCustomerIdToEntity(customer as string, {
            organizationId: metadata?.organization_id,
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
          organizationId: metadata?.organization_id || null,
          userId: metadata?.user_id || null,
          customerId: customer as string,
          type: 'SUBSCRIPTION',
          productId,
          status
        });

        // Add initial credits for subscription
        if (metadata?.organization_id && purchase) {
          const credits = getCreditsByProductId(productId);
          if (credits > 0) {
            await resetMonthlyCredits(metadata.organization_id, credits);
            logger.info(
              `🔄 Set initial monthly credits: ${credits} for organization ${metadata.organization_id}`
            );
          }
        }

        await setCustomerIdToEntity(customer as string, {
          organizationId: metadata?.organization_id,
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

          // Find the purchase record
          const purchase = await getPurchaseBySubscriptionId(subscriptionId);

          if (purchase?.organizationId) {
            const credits = getCreditsByProductId(purchase.productId);
            if (credits > 0) {
              await resetMonthlyCredits(purchase.organizationId, credits);
              logger.info(
                `🔄 Monthly credits renewed: ${credits} for organization ${purchase.organizationId}`
              );
            }
          } else {
            logger.error(
              `❌ No purchase found for subscription ${subscriptionId}`
            );
          }
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscriptionId = event.data.object.id;

        const existingPurchase =
          await getPurchaseBySubscriptionId(subscriptionId);

        if (existingPurchase) {
          await updatePurchase({
            id: existingPurchase.id,
            status: event.data.object.status,
            productId: event.data.object.items?.data[0].price?.id
          });
        }

        break;
      }
      case 'customer.subscription.deleted': {
        await deletePurchaseBySubscriptionId(event.data.object.id);

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

// Helper function to get credits by product ID
function getCreditsByProductId(productId: string): number {
  // Get all prices from all plans
  const allPrices = [
    ...config.payments.plans.starter.prices,
    ...config.payments.plans.pro.prices,
    ...config.payments.plans.max.prices
  ];
  
  const price = allPrices.find((p) => p.productId === productId);
  if (!price) return 0;
  
  // Determine credits based on plan type and interval
  // Find which plan this productId belongs to
  let planType = '';
  if (config.payments.plans.starter.prices.some(p => p.productId === productId)) {
    planType = 'starter';
  } else if (config.payments.plans.pro.prices.some(p => p.productId === productId)) {
    planType = 'pro';
  } else if (config.payments.plans.max.prices.some(p => p.productId === productId)) {
    planType = 'max';
  }
  
  // Assign credits based on plan type
  const creditsByPlan = {
    starter: 10000,  // 10k credits
    pro: 50000,      // 50k credits  
    max: 200000      // 200k credits
  };
  
  return creditsByPlan[planType as keyof typeof creditsByPlan] || 0;
}

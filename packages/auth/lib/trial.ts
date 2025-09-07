import { db } from '@repo/database';
import { logger } from '@repo/logs';

/**
 * Creates a trial purchase for a new user or organization
 */
export async function createTrialPurchase(params: {
  userId?: string;
  organizationId?: string;
  email: string;
}) {
  try {
    const { userId, organizationId, email } = params;

    // Check if trial already exists
    const existingPurchase = await db.purchase.findFirst({
      where: {
        ...(organizationId ? { organizationId } : { userId }),
        productId: 'trial'
      }
    });

    if (existingPurchase) {
      logger.info('Trial already exists', { userId, organizationId });
      return existingPurchase;
    }

    // Create trial purchase
    const trialPurchase = await db.purchase.create({
      data: {
        id: `trial_${organizationId || userId}_${Date.now()}`,
        type: 'ONE_TIME',
        status: 'COMPLETED',
        productId: 'trial',
        customerId: `trial_customer_${organizationId || userId}`,
        ...(organizationId ? { organizationId } : { userId })
      }
    });

    logger.info('Trial purchase created', {
      purchaseId: trialPurchase.id,
      userId,
      organizationId
    });

    return trialPurchase;
  } catch (error) {
    logger.error('Failed to create trial purchase', {
      error,
      userId: params.userId,
      organizationId: params.organizationId
    });
    throw error;
  }
}

/**
 * Creates a trial for an organization when it's created
 */
export async function createOrganizationTrial(
  organizationId: string,
  userEmail: string
) {
  return createTrialPurchase({
    organizationId,
    email: userEmail
  });
}

/**
 * Creates a trial for a user when they sign up (if organizations are not required)
 */
export async function createUserTrial(userId: string, userEmail: string) {
  return createTrialPurchase({
    userId,
    email: userEmail
  });
}

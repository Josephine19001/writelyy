import { db } from '../client';
import type { Prisma } from '@prisma/client';

export * from './organizations';
export * from './purchases';
export * from './users';

// Credit management functions
export async function addCreditsToOrganization(
  organizationId: string,
  credits: number,
  type: 'PURCHASE_ONETIME' | 'PURCHASE_RECURRING' | 'ADJUSTMENT',
  description?: string,
  purchaseId?: string
) {
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    // Get current organization
    const org = await tx.organization.findUnique({
      where: { id: organizationId },
      select: { creditBalance: true }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const newBalance = org.creditBalance + credits;

    // Update organization balance
    await tx.organization.update({
      where: { id: organizationId },
      data: { creditBalance: newBalance }
    });

    // Create transaction record
    await tx.creditTransaction.create({
      data: {
        organizationId,
        type,
        amount: credits,
        balance: newBalance,
        description,
        purchaseId
      }
    });

    return newBalance;
  });
}

export async function deductCreditsFromOrganization(
  organizationId: string,
  credits: number,
  postId?: string,
  description?: string
) {
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    // Get current organization
    const org = await tx.organization.findUnique({
      where: { id: organizationId },
      select: { creditBalance: true }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    // Calculate monthly usage to determine available free allowance
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get posts and total comments for this month
    const monthlyPosts = await tx.post.findMany({
      where: {
        organizationId,
        createdAt: {
          gte: startOfMonth
        }
      },
      select: {
        commentCount: true
      }
    });

    const monthlyCommentsUsed = monthlyPosts.reduce(
      (sum, post) => sum + (post.commentCount || 0),
      0
    );

    // Calculate available credits: purchased credits + remaining free allowance
    const freeMonthlyAllowance = 100;
    const freeRemaining = Math.max(
      0,
      freeMonthlyAllowance - monthlyCommentsUsed
    );
    const totalAvailableCredits = org.creditBalance + freeRemaining;

    if (totalAvailableCredits < credits) {
      throw new Error('Insufficient credits');
    }

    // Determine how to deduct credits
    let creditsToDeductFromBalance = 0;

    if (freeRemaining >= credits) {
      // Use only free allowance - no deduction from balance needed
      creditsToDeductFromBalance = 0;
    } else {
      // Use all free allowance + some purchased credits
      creditsToDeductFromBalance = credits - freeRemaining;
    }

    const newBalance = org.creditBalance - creditsToDeductFromBalance;

    // Update organization balance only if we're deducting from purchased credits
    if (creditsToDeductFromBalance > 0) {
      await tx.organization.update({
        where: { id: organizationId },
        data: { creditBalance: newBalance }
      });
    }

    // Create transaction record showing total credits used
    await tx.creditTransaction.create({
      data: {
        organizationId,
        type: 'USAGE',
        amount: -credits,
        balance: newBalance,
        description: `${description} (${credits - creditsToDeductFromBalance} from free allowance, ${creditsToDeductFromBalance} from purchased credits)`,
        postId
      }
    });

    return newBalance;
  });
}

export async function getOrganizationCreditBalance(organizationId: string) {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      creditBalance: true,
      lastCreditReset: true,
      nextCreditReset: true
    }
  });

  return org;
}

export async function resetMonthlyCredits(
  organizationId: string,
  credits: number
) {
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setMonth(nextReset.getMonth() + 1);

    // Update organization balance and reset dates
    await tx.organization.update({
      where: { id: organizationId },
      data: {
        creditBalance: credits,
        lastCreditReset: now,
        nextCreditReset: nextReset
      }
    });

    // Create transaction record
    await tx.creditTransaction.create({
      data: {
        organizationId,
        type: 'RESET',
        amount: credits,
        balance: credits,
        description: 'Monthly credit reset'
      }
    });

    return credits;
  });
}

export async function getCreditTransactionHistory(
  organizationId: string,
  limit = 50,
  offset = 0
) {
  return db.creditTransaction.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset
  });
}

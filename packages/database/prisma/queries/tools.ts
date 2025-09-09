import type { Prisma } from "@prisma/client";
import { db } from "../client";

// Humanizer queries
export async function createHumanizerUsage(
  data: Prisma.HumanizerUsageCreateInput
) {
  const usage = await db.humanizerUsage.create({ data });
  
  // Update monthly usage tracking
  if (data.wordCount && data.user?.connect?.id) {
    await createOrUpdateMonthlyUsage(data.user.connect.id, data.wordCount, 'humanizer');
  }
  
  return usage;
}

export async function getHumanizerUsageByUserId({
  userId,
  limit = 10,
  offset = 0,
}: {
  userId: string;
  limit?: number;
  offset?: number;
}) {
  return db.humanizerUsage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function deleteHumanizerUsage(id: string, userId: string) {
  return db.humanizerUsage.deleteMany({
    where: { 
      id,
      userId // Ensure user can only delete their own records
    }
  });
}

// Detector queries  
export async function createDetectorUsage(
  data: Prisma.DetectorUsageCreateInput
) {
  const usage = await db.detectorUsage.create({ data });
  
  // Update monthly usage tracking
  if (data.wordCount && data.user?.connect?.id) {
    await createOrUpdateMonthlyUsage(data.user.connect.id, data.wordCount, 'detector');
  }
  
  return usage;
}

export async function getDetectorUsageByUserId({
  userId,
  limit = 10,
  offset = 0,
}: {
  userId: string;
  limit?: number;
  offset?: number;
}) {
  return db.detectorUsage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function deleteDetectorUsage(id: string, userId: string) {
  return db.detectorUsage.deleteMany({
    where: { 
      id,
      userId // Ensure user can only delete their own records
    }
  });
}

// Summariser queries
export async function createSummariserUsage(
  data: Prisma.SummariserUsageCreateInput
) {
  const usage = await db.summariserUsage.create({ data });
  
  // Update monthly usage tracking
  if (data.wordCount && data.user?.connect?.id) {
    await createOrUpdateMonthlyUsage(data.user.connect.id, data.wordCount, 'summariser');
  }
  
  return usage;
}

export async function getSummariserUsageByUserId({
  userId,
  limit = 10,
  offset = 0,
}: {
  userId: string;
  limit?: number;
  offset?: number;
}) {
  return db.summariserUsage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function deleteSummariserUsage(id: string, userId: string) {
  return db.summariserUsage.deleteMany({
    where: { 
      id,
      userId // Ensure user can only delete their own records
    }
  });
}

// Paraphraser queries
export async function createParaphraserUsage(
  data: Prisma.ParaphraserUsageCreateInput
) {
  const usage = await db.paraphraserUsage.create({ data });
  
  // Update monthly usage tracking
  if (data.wordCount && data.user?.connect?.id) {
    await createOrUpdateMonthlyUsage(data.user.connect.id, data.wordCount, 'paraphraser');
  }
  
  return usage;
}

export async function getParaphraserUsageByUserId({
  userId,
  limit = 10,
  offset = 0,
}: {
  userId: string;
  limit?: number;
  offset?: number;
}) {
  return db.paraphraserUsage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

export async function deleteParaphraserUsage(id: string, userId: string) {
  return db.paraphraserUsage.deleteMany({
    where: { 
      id,
      userId // Ensure user can only delete their own records
    }
  });
}

// Combined usage stats
export async function getUserToolsUsageStats(userId: string) {
  const [humanizerCount, detectorCount, summariserCount, paraphraserCount] = await Promise.all([
    db.humanizerUsage.count({ where: { userId } }),
    db.detectorUsage.count({ where: { userId } }),
    db.summariserUsage.count({ where: { userId } }),
    db.paraphraserUsage.count({ where: { userId } }),
  ]);

  return {
    humanizer: humanizerCount,
    detector: detectorCount,
    summariser: summariserCount,
    paraphraser: paraphraserCount,
    total: humanizerCount + detectorCount + summariserCount + paraphraserCount,
  };
}

// Clean up expired records (for GDPR compliance)
export async function cleanupExpiredToolsUsage() {
  const now = new Date();
  
  const [humanizer, detector, summariser, paraphraser] = await Promise.all([
    db.humanizerUsage.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    }),
    db.detectorUsage.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    }),
    db.summariserUsage.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    }),
    db.paraphraserUsage.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    }),
  ]);

  return {
    deletedRecords: {
      humanizer: humanizer.count,
      detector: detector.count,
      summariser: summariser.count,
      paraphraser: paraphraser.count,
    },
    totalDeleted: humanizer.count + detector.count + summariser.count + paraphraser.count,
  };
}

// Monthly usage tracking functions
export async function getMonthlyUsage(userId: string, month?: number, year?: number) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  // @ts-ignore - Prisma client will be regenerated after migration
  return db.monthlyUsage.findUnique({
    where: {
      userId_month_year: {
        userId,
        month: targetMonth,
        year: targetYear,
      },
    },
  });
}

export async function createOrUpdateMonthlyUsage(
  userId: string,
  wordCount: number,
  toolType: 'humanizer' | 'detector' | 'summariser' | 'paraphraser',
  month?: number,
  year?: number
) {
  const now = new Date();
  const targetMonth = month ?? now.getMonth() + 1;
  const targetYear = year ?? now.getFullYear();

  const updateData = {
    totalWords: { increment: wordCount },
    [`${toolType}Words`]: { increment: wordCount },
  };

  // @ts-ignore - Prisma client will be regenerated after migration
  return db.monthlyUsage.upsert({
    where: {
      userId_month_year: {
        userId,
        month: targetMonth,
        year: targetYear,
      },
    },
    create: {
      userId,
      month: targetMonth,
      year: targetYear,
      totalWords: wordCount,
      [`${toolType}Words`]: wordCount,
    },
    update: updateData,
  });
}

export async function checkMonthlyWordLimit(userId: string, requestedWords: number): Promise<{
  allowed: boolean;
  currentUsage: number;
  wordLimit: number;
  remainingWords: number;
  message?: string;
}> {
  // Get user's word limit
  // @ts-ignore - Prisma client will be regenerated after migration
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { monthlyWordLimit: true },
  });

  if (!user) {
    return {
      allowed: false,
      currentUsage: 0,
      wordLimit: 0,
      remainingWords: 0,
      message: 'User not found',
    };
  }

  // Get current month's usage
  const monthlyUsage = await getMonthlyUsage(userId);
  const currentUsage = monthlyUsage?.totalWords ?? 0;
  // @ts-ignore - Prisma client will be regenerated after migration
  const wordLimit = user.monthlyWordLimit;
  const remainingWords = wordLimit - currentUsage;

  // Check if request would exceed limit
  const allowed = (currentUsage + requestedWords) <= wordLimit;

  return {
    allowed,
    currentUsage,
    wordLimit,
    remainingWords,
    message: allowed ? undefined : `Request would exceed monthly word limit. You have ${remainingWords} words remaining this month.`,
  };
}

export async function getUserMonthlyStats(userId: string) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [user, monthlyUsage] = await Promise.all([
    // @ts-ignore - Prisma client will be regenerated after migration
    db.user.findUnique({
      where: { id: userId },
      select: { monthlyWordLimit: true },
    }),
    getMonthlyUsage(userId, currentMonth, currentYear),
  ]);

  if (!user) {
    throw new Error('User not found');
  }

  const currentUsage = monthlyUsage?.totalWords ?? 0;
  // @ts-ignore - Prisma client will be regenerated after migration
  const wordLimit = user.monthlyWordLimit;
  const remainingWords = Math.max(0, wordLimit - currentUsage);
  const usagePercentage = wordLimit > 0 ? (currentUsage / wordLimit) * 100 : 0;

  return {
    currentUsage,
    wordLimit,
    remainingWords,
    usagePercentage: Math.min(100, usagePercentage),
    breakdown: {
      humanizer: monthlyUsage?.humanizerWords ?? 0,
      detector: monthlyUsage?.detectorWords ?? 0,
      summariser: monthlyUsage?.summariserWords ?? 0,
      paraphraser: monthlyUsage?.paraphraserWords ?? 0,
    },
    month: currentMonth,
    year: currentYear,
  };
}

// Helper function to update user's monthly word limit
export async function updateUserWordLimit(userId: string, newLimit: number) {
  // @ts-ignore - Prisma client will be regenerated after migration
  return db.user.update({
    where: { id: userId },
    data: { monthlyWordLimit: newLimit },
  });
}
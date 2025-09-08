-- Migration: Add Monthly Usage Tracking
-- This migration adds monthly word limit tracking across all tools

-- Add monthlyWordLimit field to User table
ALTER TABLE "user" 
ADD COLUMN "monthlyWordLimit" INTEGER NOT NULL DEFAULT 1000;

-- Create MonthlyUsage table for tracking user word usage by month
CREATE TABLE "monthly_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalWords" INTEGER NOT NULL DEFAULT 0,
    "humanizerWords" INTEGER NOT NULL DEFAULT 0,
    "detectorWords" INTEGER NOT NULL DEFAULT 0,
    "summariserWords" INTEGER NOT NULL DEFAULT 0,
    "paraphraserWords" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_usage_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint for userId + month + year
CREATE UNIQUE INDEX "monthly_usage_userId_month_year_key" ON "monthly_usage"("userId", "month", "year");

-- Create indexes for performance
CREATE INDEX "monthly_usage_userId_idx" ON "monthly_usage"("userId");
CREATE INDEX "monthly_usage_month_year_idx" ON "monthly_usage"("month", "year");

-- Add foreign key constraint
ALTER TABLE "monthly_usage" ADD CONSTRAINT "monthly_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Optional: Populate existing users with higher limits (adjust as needed)
-- UPDATE "user" SET "monthlyWordLimit" = 50000 WHERE "role" = 'premium';
-- UPDATE "user" SET "monthlyWordLimit" = 100000 WHERE "role" = 'unlimited';
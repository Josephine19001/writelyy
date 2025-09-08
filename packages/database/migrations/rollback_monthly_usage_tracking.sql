-- Rollback: Remove Monthly Usage Tracking
-- This script removes the monthly usage tracking features

-- Drop the monthly_usage table (this will also drop the foreign key constraint)
DROP TABLE IF EXISTS "monthly_usage";

-- Remove the monthlyWordLimit column from user table
ALTER TABLE "user" DROP COLUMN IF EXISTS "monthlyWordLimit";
-- Migration: Add location and specifications fields to Product table
-- Date: 2025-01-XX

-- Add location column
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "location" TEXT;

-- Add specifications column (stored as JSON)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "specifications" TEXT;

-- Add index on location for faster searches (optional but recommended)
CREATE INDEX IF NOT EXISTS "Product_location_idx" ON "Product"("location");

-- Add condition and brand fields to Product table
-- This migration adds support for NEW/USED machine filtering and brand filtering

-- Add condition enum (if using MySQL, you may need to create it differently)
-- For MySQL, we'll use VARCHAR with a CHECK constraint or just VARCHAR
ALTER TABLE `Product` 
ADD COLUMN `condition` ENUM('NEW', 'USED') NULL DEFAULT 'NEW',
ADD COLUMN `brand` VARCHAR(191) NULL;

-- Add index on condition for faster filtering
CREATE INDEX `Product_condition_idx` ON `Product` (`condition`);

-- Add index on brand for faster filtering
CREATE INDEX `Product_brand_idx` ON `Product` (`brand`);

-- Add composite index for category + condition filtering
CREATE INDEX `Product_categoryId_condition_idx` ON `Product` (`categoryId`, `condition`);

-- Add composite index for category + brand filtering
CREATE INDEX `Product_categoryId_brand_idx` ON `Product` (`categoryId`, `brand`);


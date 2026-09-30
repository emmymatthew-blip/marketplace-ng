-- Create ProductCategory table
CREATE TABLE IF NOT EXISTS `ProductCategory` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(191) NULL,
  `parentId` VARCHAR(191) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ProductCategory_name_key` (`name`),
  UNIQUE INDEX `ProductCategory_slug_key` (`slug`),
  INDEX `ProductCategory_parentId_idx` (`parentId`),
  CONSTRAINT `ProductCategory_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ProductCategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add categoryId column to Product table
ALTER TABLE `Product` ADD COLUMN `categoryId` VARCHAR(191) NULL;

-- Add foreign key constraint
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` 
FOREIGN KEY (`categoryId`) REFERENCES `ProductCategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index for better performance
CREATE INDEX `Product_categoryId_idx` ON `Product` (`categoryId`);

-- Remove the old category column (optional - you might want to keep it for migration)
-- ALTER TABLE `Product` DROP COLUMN `category`;

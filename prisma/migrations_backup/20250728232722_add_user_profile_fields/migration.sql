-- AlterTable
ALTER TABLE `user` ADD COLUMN `cityState` VARCHAR(191) NULL,
    ADD COLUMN `companyWebsite` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `jobTitle` VARCHAR(191) NULL,
    ADD COLUMN `newsletterSubscription` VARCHAR(191) NULL DEFAULT 'no';

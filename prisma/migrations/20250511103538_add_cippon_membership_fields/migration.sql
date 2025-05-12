/*
  Warnings:

  - You are about to drop the column `cipponId` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `cipponId`,
    ADD COLUMN `cipponLicenseNumber` VARCHAR(191) NULL,
    ADD COLUMN `cipponMembershipNumber` VARCHAR(191) NULL;

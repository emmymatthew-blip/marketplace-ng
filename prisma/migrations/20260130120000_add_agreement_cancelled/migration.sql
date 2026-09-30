-- AlterEnum: add CANCELLED for declined/withdrawn agreements
ALTER TYPE "AgreementStatus" ADD VALUE 'CANCELLED';

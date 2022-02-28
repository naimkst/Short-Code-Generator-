-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email_verify_status" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

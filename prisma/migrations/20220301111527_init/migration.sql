/*
  Warnings:

  - Made the column `email_verify_status` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Shorter" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email_verify_status" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Shorter" ADD CONSTRAINT "Shorter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

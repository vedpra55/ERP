/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `sys_users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `verificationToken` on table `sys_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "sys_users" ALTER COLUMN "verificationToken" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sys_users_verificationToken_key" ON "sys_users"("verificationToken");

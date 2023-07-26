-- DropIndex
DROP INDEX "sys_users_verificationToken_key";

-- AlterTable
ALTER TABLE "sys_users" ALTER COLUMN "verificationToken" DROP NOT NULL;

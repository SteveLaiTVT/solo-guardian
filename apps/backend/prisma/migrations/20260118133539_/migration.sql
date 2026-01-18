-- AlterTable
ALTER TABLE "user_preferences" ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'standard';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birth_year" INTEGER;

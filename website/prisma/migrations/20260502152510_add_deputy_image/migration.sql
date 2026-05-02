/*
  Warnings:

  - You are about to drop the column `article_type` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "article_type",
ADD COLUMN     "source" TEXT;

-- AlterTable
ALTER TABLE "deputies" ADD COLUMN     "dep_image_url" TEXT;

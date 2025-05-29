/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Blog_authorId_key" ON "Blog"("authorId");

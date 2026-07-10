/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `View` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "View_userId_postId_key" ON "View"("userId", "postId");

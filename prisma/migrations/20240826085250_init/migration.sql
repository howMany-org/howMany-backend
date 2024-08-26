/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "steamId" BIGINT NOT NULL,
    "steamName" TEXT NOT NULL,
    "steamJoinDate" TIMESTAMP(3) NOT NULL,
    "avatarHash" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_steamId_key" ON "Users"("steamId");

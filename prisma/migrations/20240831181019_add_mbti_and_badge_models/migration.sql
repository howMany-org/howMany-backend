/*
  Warnings:

  - You are about to alter the column `steamName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `avatarHash` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "mbtiType" VARCHAR(4),
ALTER COLUMN "steamName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "avatarHash" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "badgeHash" VARCHAR(255) NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MbtiAnswer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" VARCHAR(50) NOT NULL,

    CONSTRAINT "MbtiAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MbtiQuestion" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "MbtiQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MbtiResult" (
    "id" SERIAL NOT NULL,
    "mbtiType" VARCHAR(4) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "MbtiResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MbtiAnswer" ADD CONSTRAINT "MbtiAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MbtiQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

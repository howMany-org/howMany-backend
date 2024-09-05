/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "steam_id" BIGINT NOT NULL,
    "steam_name" TEXT NOT NULL,
    "steam_join_date" TIMESTAMP(3) NOT NULL,
    "avatar_hash" TEXT,
    "mbti_type" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

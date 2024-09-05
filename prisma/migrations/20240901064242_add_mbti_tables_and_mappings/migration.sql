/*
  Warnings:

  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MbtiAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MbtiQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MbtiResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MbtiAnswer" DROP CONSTRAINT "MbtiAnswer_questionId_fkey";

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "MbtiAnswer";

-- DropTable
DROP TABLE "MbtiQuestion";

-- DropTable
DROP TABLE "MbtiResult";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "app_id" INTEGER NOT NULL,
    "image_hash" TEXT,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti_answers" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "mbti_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti_game_mapping" (
    "id" SERIAL NOT NULL,
    "mbti_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "mbti_game_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti_questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "mbti_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti_result" (
    "id" SERIAL NOT NULL,
    "mbti_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "mbti_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "steam_id" BIGINT NOT NULL,
    "steam_name" TEXT NOT NULL,
    "steam_join_date" TIMESTAMP(3) NOT NULL,
    "avatar_hash" TEXT,
    "mbti_type" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FK_mbti_questions_TO_mbti_answers" ON "mbti_answers"("question_id");

-- CreateIndex
CREATE INDEX "FK_mbti_result_TO_mbti_game_mapping" ON "mbti_game_mapping"("mbti_id");

-- CreateIndex
CREATE INDEX "FK_game_TO_mbti_game_mapping" ON "mbti_game_mapping"("game_id");

-- AddForeignKey
ALTER TABLE "mbti_answers" ADD CONSTRAINT "mbti_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mbti_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mbti_game_mapping" ADD CONSTRAINT "mbti_game_mapping_mbti_id_fkey" FOREIGN KEY ("mbti_id") REFERENCES "mbti_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mbti_game_mapping" ADD CONSTRAINT "mbti_game_mapping_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

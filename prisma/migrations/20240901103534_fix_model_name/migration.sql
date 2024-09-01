/*
  Warnings:

  - You are about to drop the `mbti_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mbti_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mbti_result` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mbti_answers" DROP CONSTRAINT "mbti_answers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "mbti_game_mapping" DROP CONSTRAINT "mbti_game_mapping_mbti_id_fkey";

-- DropTable
DROP TABLE "mbti_answers";

-- DropTable
DROP TABLE "mbti_questions";

-- DropTable
DROP TABLE "mbti_result";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "mbti_answer" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "mbti_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti_question" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "mbti_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti" (
    "id" SERIAL NOT NULL,
    "mbti_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "mbti_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE INDEX "FK_mbti_question_to_mbti_answer" ON "mbti_answer"("question_id");

-- AddForeignKey
ALTER TABLE "mbti_answer" ADD CONSTRAINT "mbti_answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mbti_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mbti_game_mapping" ADD CONSTRAINT "mbti_game_mapping_mbti_id_fkey" FOREIGN KEY ("mbti_id") REFERENCES "mbti"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "FK_game_TO_mbti_game_mapping" RENAME TO "FK_game_to_mbti_game_mapping";

-- RenameIndex
ALTER INDEX "FK_mbti_result_TO_mbti_game_mapping" RENAME TO "FK_mbti_to_mbti_game_mapping";

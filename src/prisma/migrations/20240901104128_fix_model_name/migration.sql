/*
  Warnings:

  - You are about to drop the `mbti_answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mbti_question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mbti_answer" DROP CONSTRAINT "mbti_answer_question_id_fkey";

-- DropTable
DROP TABLE "mbti_answer";

-- DropTable
DROP TABLE "mbti_question";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "mbti_answers" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "mbti_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mbti_questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "mbti_questions_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "mbti_answers" ADD CONSTRAINT "mbti_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mbti_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "FK_game_to_mbti_game_mapping" RENAME TO "FK_game_TO_mbti_game_mapping";

-- RenameIndex
ALTER INDEX "FK_mbti_to_mbti_game_mapping" RENAME TO "FK_mbti_TO_mbti_game_mapping";

/*
  Warnings:

  - You are about to drop the `mbti_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mbti_questions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mbti_answers" DROP CONSTRAINT "mbti_answers_question_id_fkey";

-- DropTable
DROP TABLE "mbti_answers";

-- DropTable
DROP TABLE "mbti_questions";

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

-- CreateIndex
CREATE INDEX "FK_mbti_question_TO_mbti_answer" ON "mbti_answer"("question_id");

-- AddForeignKey
ALTER TABLE "mbti_answer" ADD CONSTRAINT "mbti_answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "mbti_question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

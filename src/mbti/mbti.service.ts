import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MbtiService {
  constructor(private prisma: PrismaService) {}

  async getQuestionData(questionId: number) {
    const question = await this.prisma.mbtiQuestion.findUnique({
      where: { id: questionId },
      include: { mbtiAnswer: true }, // 질문과 관련된 답변들을 포함
    });
    if (!question) {
      throw new Error(`Question with ID ${questionId} not found.`);
    }
    return question;
  }

  analyzeAnswers(answers: number[]): {
    mbtiType: string;
    scores: { [key: string]: number };
  } {
    let initialScores: { [key: string]: number } = {
      I: 0,
      E: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

    const answerMappings: { [index: number]: [string, string] } = {
      0: ['I', 'E'],
      1: ['N', 'S'],
      2: ['P', 'J'],
      3: ['N', 'S'],
      4: ['T', 'F'],
      5: ['N', 'S'],
      6: ['P', 'J'],
      7: ['S', 'N'],
      8: ['T', 'F'],
      9: ['J', 'P'],
      10: ['P', 'J'],
      11: ['I', 'E'],
      12: ['J', 'P'],
      13: ['N', 'S'],
      14: ['F', 'T'],
      15: ['T', 'F'],
      16: ['N', 'S'],
      17: ['E', 'I'],
      18: ['J', 'P'],
      19: ['P', 'J'],
    };

    const scores = answers.reduce(
      (accumulator, currentValue, currentIndex) => {
        const [type1, type2] = answerMappings[currentIndex];
        accumulator[currentValue === 0 ? type1 : type2]++;
        return accumulator;
      },
      { ...initialScores },
    );

    return {
      mbtiType:
        (scores.I > scores.E ? 'I' : 'E') +
        (scores.N > scores.S ? 'N' : 'S') +
        (scores.T > scores.F ? 'T' : 'F') +
        (scores.J > scores.P ? 'J' : 'P'),
      scores,
    };
  }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // await prisma.mbtiQuestion.deleteMany({});
    // await prisma.mbtiAnswer.deleteMany({});
    // await prisma.game.deleteMany({});
    // await prisma.mbti.deleteMany({});
    // await prisma.mbtiGameMapping.deleteMany({});
    
    // MBTI 질문지 데이터
      const questions = await prisma.mbtiQuestion.createMany({
        data: [
          { question: '혼자 게임하는 것을 좋아하나요, 아니면 다른 사람들과 함께 하는 것을 좋아하나요?' }, // 1
          { question: '전략적인 사고가 필요한 게임을 좋아하시나요?' }, // 2
          { question: '빠른 템포의 게임을 좋아하시나요, 아니면 느리고 체계적인 게임을 좋아하시나요?' }, // 3
          { question: '오픈 월드를 탐험하는 것을 좋아하시나요, 아니면 선형적인 스토리를 따르는 것을 좋아하시나요?' }, // 4
          { question: '경쟁적인 게임을 더 좋아하시나요, 아니면 협력적인 게임을 더 좋아하시나요?' }, // 5
          { question: '강력한 내러티브가 있는 게임을 좋아하시나요, 아니면 게임 플레이에 중점을 둔 게임을 좋아하시나요?' }, // 6
          { question: '캐릭터와 환경을 커스터마이징하는 것을 좋아하시나요?' }, // 7
          { question: '현실적인 그래픽을 선호하시나요, 아니면 스타일화된 그래픽을 선호하시나요?' }, // 8
          { question: '게임에서 퍼즐을 푸는 것을 좋아하시나요?' }, // 9
          { question: '도전적인 게임을 좋아하시나요, 아니면 더 여유롭고 쉬운 게임을 좋아하시나요?' }, // 10
          { question: '게임에서 무언가를 만들고 창조하는 것을 좋아하시나요?' }, // 11
          { question: '싱글 플레이어 게임을 선호하시나요, 아니면 멀티 플레이어 게임을 선호하시나요?' }, // 12
          { question: '규칙을 따르는 것을 좋아하시나요, 아니면 더 자유롭게 플레이하는 것을 좋아하시나요?' }, // 13
          { question: '롤플레잉 게임(RPG)을 좋아하시나요?' }, // 14
          { question: '스토리 중심의 게임을 선호하시나요, 아니면 액션 중심의 게임을 선호하시나요?' }, // 15
          { question: '빠른 반사신경이 필요한 게임을 좋아하시나요?' }, // 16
          { question: '깊은 스토리가 있는 게임을 선호하시나요, 아니면 단순하고 직관적인 게임을 선호하시나요?' }, // 17
          { question: '게임에서 영웅 역할을 더 좋아하시나요, 아니면 악당 역할을 더 좋아하시나요?' }, // 18
          { question: '실제 생활 활동을 시뮬레이션하는 게임을 좋아하시나요?' }, // 19
          { question: '자원 관리를 요구하는 게임을 좋아하시나요?' }, // 20
        ],
      });
      console.log('MBTI 질문 데이터 생성 완료.');

    // MBTI 답변 데이터
    await prisma.mbtiAnswer.createMany({
      data: [
        { answer: '혼자', questionId: 1 },
        { answer: '함께', questionId: 1 },
        { answer: '예', questionId: 2 },
        { answer: '아니요', questionId: 2 },
        { answer: '빠른 템포', questionId: 3 },
        { answer: '느리고 체계적', questionId: 3 },
        { answer: '오픈 월드', questionId: 4 },
        { answer: '선형적인 스토리', questionId: 4 },
        { answer: '경쟁적', questionId: 5 },
        { answer: '협력적', questionId: 5 },
        { answer: '강력한 내러티브', questionId: 6 },
        { answer: '게임 플레이 중심', questionId: 6 },
        { answer: '예', questionId: 7 },
        { answer: '아니요', questionId: 7 },
        { answer: '현실적인', questionId: 8 },
        { answer: '스타일화된', questionId: 8 },
        { answer: '예', questionId: 9 },
        { answer: '아니요', questionId: 9 },
        { answer: '도전적', questionId: 10 },
        { answer: '여유로운', questionId: 10 },
        { answer: '예', questionId: 11 },
        { answer: '아니요', questionId: 11 },
        { answer: '싱글 플레이어', questionId: 12 },
        { answer: '멀티 플레이어', questionId: 12 },
        { answer: '규칙 따르기', questionId: 13 },
        { answer: '자유롭게', questionId: 13 },
        { answer: '예', questionId: 14 },
        { answer: '아니요', questionId: 14 },
        { answer: '스토리 중심', questionId: 15 },
        { answer: '액션 중심', questionId: 15 },
        { answer: '예', questionId: 16 },
        { answer: '아니요', questionId: 16 },
        { answer: '깊은 스토리', questionId: 17 },
        { answer: '단순한 게임플레이', questionId: 17 },
        { answer: '영웅', questionId: 18 },
        { answer: '악당', questionId: 18 },
        { answer: '예', questionId: 19 },
        { answer: '아니요', questionId: 19 },
        { answer: '예', questionId: 20 },
        { answer: '아니요', questionId: 20 },
      ],
    });

    // Game 데이터
    await prisma.game.createMany({
      data: [
        { title: "Sid Meier's Civilization VI", appId: 0 }, // 1
        { title: 'Portal 2', appId: 0 }, // 2
        { title: 'XCOM 2', appId: 0 }, // 3
        { title: 'Factorio', appId: 0 }, // 4
        { title: 'Kerbal Space Program', appId: 0 }, // 5
        { title: 'Cities: Skylines', appId: 0 }, // 6
        { title: 'Total War: WARHAMMER II', appId: 0 }, // 7
        { title: 'Dota 2', appId: 0 }, // 8
        { title: 'Stellaris', appId: 0 }, // 9
        { title: 'The Witcher 3: Wild Hunt', appId: 0 }, // 10
        { title: 'Life is Strange', appId: 0 }, // 11
        { title: 'Mass Effect Legendary Edition', appId: 0 }, // 12
        { title: 'Journey', appId: 0 }, // 13
        { title: 'Stardew Valley', appId: 0 }, // 14
        { title: 'The Elder Scrolls V: Skyrim', appId: 0 }, // 15
        { title: 'Overcooked! 2', appId: 0 }, // 16
        { title: 'Firewatch', appId: 0 }, // 17
        { title: 'Undertale', appId: 0 }, // 18
        { title: 'Grand Theft Auto V', appId: 0 }, // 19
        { title: 'Metal Gear Solid V: The Phantom Pain', appId: 0 }, // 20
        { title: 'Arma 3', appId: 0 }, // 21
        { title: 'Horizon Zero Dawn', appId: 0 }, // 22
        { title: 'Shadow of the Tomb Raider', appId: 0 }, // 23
        { title: 'Call of Duty: Warzone', appId: 0 }, // 24
        { title: 'Fortnite', appId: 0 }, // 25
        { title: 'Apex Legends', appId: 0 }, // 26
        { title: 'Just Dance 2024', appId: 0 }, // 27
        { title: 'Pummel Party', appId: 0 }, // 28
        { title: 'The Jackbox Party Pack 7', appId: 0 }, // 29
      ],
    });

    // MBTI 데이터
    await prisma.mbti.createMany({
      data: [
        { mbtiType: 'INTJ', description: '건축가' }, // 1
        { mbtiType: 'INTP', description: '논리학자' }, // 2
        { mbtiType: 'ENTJ', description: '지휘관' }, // 3
        { mbtiType: 'ENTP', description: '토론가' }, // 4
        { mbtiType: 'INFJ', description: '옹호자' }, // 5
        { mbtiType: 'INFP', description: '중재자' }, // 6
        { mbtiType: 'ENFJ', description: '주도자' }, // 7
        { mbtiType: 'ENFP', description: '활동가' }, // 8
        { mbtiType: 'ISTJ', description: '현실주의자' }, // 9
        { mbtiType: 'ISFJ', description: '수호자' }, // 10
        { mbtiType: 'ESTJ', description: '경영자' }, // 11
        { mbtiType: 'ESFJ', description: '외교관' }, // 12
        { mbtiType: 'ISTP', description: '장인' }, // 13
        { mbtiType: 'ISFP', description: '모험가' }, // 14
        { mbtiType: 'ESTP', description: '기업가' }, // 15
        { mbtiType: 'ESFP', description: '연예인' }, // 16
      ],
    });

    // MBTI와 게임 매핑
    await prisma.mbtiGameMapping.createMany({
      data: [
        // INTJ
        { mbtiId: 1, gameId: 1 }, // Sid Meier's Civilization VI
        { mbtiId: 1, gameId: 2 }, // Portal 2
        { mbtiId: 1, gameId: 3 }, // XCOM 2

        // INTP
        { mbtiId: 2, gameId: 5 }, // Kerbal Space Program
        { mbtiId: 2, gameId: 4 }, // Factorio
        { mbtiId: 2, gameId: 6 }, // Cities: Skylines

        // ENTJ
        { mbtiId: 3, gameId: 7 }, // Total War: WARHAMMER II
        { mbtiId: 3, gameId: 8 }, // Dota 2
        { mbtiId: 3, gameId: 19 }, // Grand Theft Auto V

        // ENTP
        { mbtiId: 4, gameId: 5 }, // Kerbal Space Program
        { mbtiId: 4, gameId: 2 }, // Portal 2
        { mbtiId: 4, gameId: 9 }, // Stellaris

        // INFJ
        { mbtiId: 5, gameId: 10 }, // The Witcher 3: Wild Hunt
        { mbtiId: 5, gameId: 11 }, // Life is Strange
        { mbtiId: 5, gameId: 12 }, // Mass Effect Legendary Edition

        // INFP
        { mbtiId: 6, gameId: 13 }, // Journey
        { mbtiId: 6, gameId: 14 }, // Stardew Valley
        { mbtiId: 6, gameId: 15 }, // The Elder Scrolls V: Skyrim

        // ENFJ
        { mbtiId: 7, gameId: 16 }, // Overcooked! 2
        { mbtiId: 7, gameId: 11 }, // Life is Strange
        { mbtiId: 7, gameId: 17 }, // A Way Out

        // ENFP
        { mbtiId: 8, gameId: 15 }, // The Elder Scrolls V: Skyrim
        { mbtiId: 8, gameId: 17 }, // Firewatch
        { mbtiId: 8, gameId: 18 }, // Undertale

        // ISTJ
        { mbtiId: 9, gameId: 6 }, // Cities: Skylines
        { mbtiId: 9, gameId: 4 }, // Factorio
        { mbtiId: 9, gameId: 20 }, // Anno 1800

        // ISFJ
        { mbtiId: 10, gameId: 21 }, // The Sims 4
        { mbtiId: 10, gameId: 22 }, // Animal Crossing: New Horizons
        { mbtiId: 10, gameId: 23 }, // Harvest Moon: Light of Hope

        // ESTJ
        { mbtiId: 11, gameId: 24 }, // Age of Empires II: Definitive Edition
        { mbtiId: 11, gameId: 25 }, // Football Manager 2023
        { mbtiId: 11, gameId: 26 }, // Crusader Kings III

        // ESFJ
        { mbtiId: 12, gameId: 16 }, // Overcooked! 2
        { mbtiId: 12, gameId: 21 }, // The Sims 4
        { mbtiId: 12, gameId: 27 }, // Among Us

        // ISTP
        { mbtiId: 13, gameId: 19 }, // Grand Theft Auto V
        { mbtiId: 13, gameId: 22 }, // Horizon Zero Dawn
        { mbtiId: 13, gameId: 28 }, // Pummel Party
      ],
    });
  } catch (e) {
    console.error('Error occurred:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

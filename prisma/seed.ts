import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Game 데이터 추가
  const games = await prisma.game.createMany({
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
  // MBTI 데이터 추가
  const mbtiTypes = await prisma.mbti.createMany({
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

  // MBTI와 게임 매핑 추가
  const mbtiGameMappings = await prisma.mbtiGameMapping.createMany({
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
      { mbtiId: 13, gameId: 19 }, // Grand
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

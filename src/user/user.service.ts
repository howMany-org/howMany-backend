import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import config from 'src/config/configuration';
const puppeteer = require('puppeteer');

const settings = config();

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async getPlayerSummaries(id: string) {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${settings.api.steam}&steamids=${id}`;
    console.log(settings.api.steam);
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(url)
          .pipe(map((response: AxiosResponse) => response.data)),
      );

      const user = response.response.players[0];
      return {
        steamName: user.personaname,
        steamId: user.steamid,
        steamProfileUrl: user.profileurl,
        steamAvatarUrl: user.avatarfull,
        steamJoinDate: new Date(user.timecreated * 1000).toISOString(),
      };
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.error(
          '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      } else {
        console.error('오류 발생:', error.message);
      }
    }
  }

  async getGamePrice(appId: number) {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=kr`;
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(url)
          .pipe(map((response: AxiosResponse) => response.data)),
      );

      const gameData = response[`${appId}`].data;

      if (gameData) {
        if (!gameData.is_free) {
          const price = gameData.price_overview.final;
          console.log(`Price: ${price}`);
          console.log(price);
          return price;
        } else if (gameData.is_free) {
          // console.log('Price: 무료');
        } else {
          console.log('Price information not available');
        }
      } else {
        console.log('No game data found');
      }

      // const formatPrice(krw: number): string {
      //   const formattedPrice = Math.floor(krw / 100); // 마지막 두 자리 제거
      //   return `₩ ${formattedPrice.toLocaleString()}`; // 쉼표 추가
      // }

      // // 게임이 1000개를 초과하면 가격 계산 로직을 실행하지 않음
      // let totalPrice = 0;
      // if (totalGamesCount <= 1000) {
      //   totalPrice = await Promise.all(
      //     games.map(async (game) => {
      //       const price = await this.getGamePrice(game.appid);
      //       return price;
      //     }),
      //   ).then((prices) => prices.reduce((total, price) => total + price, 0));
      // } else {
      //   console.log('게임 개수가 1000개를 초과하여 가격 계산을 생략합니다.');
      // }
      // 가격 합산

      // const totalPrice = games.reduce((total, game) => {
      //   const price = this.getGamePrice(game.appid);
      //   return (total = game.Price);
      // }, 0);
      // console.log('Total Price: ', totalPrice);
      //   const response = await firstValueFrom(
      //     this.httpService
      //       .get(url)
      //       .pipe(map((response: AxiosResponse) => response.data)),
      //   );
      //   const gameData = response[`${appId}`].data;
      //   if (gameData && gameData.price_overview) {
      //     const price = gameData.price_overview.final_formatted;
      //     console.log(`Price: ${price}`);
      //   } else {
      //     console.log('Price information not available');
      //   }
      //   return response;
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.error(
          '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      } else {
        console.log('에러앱 id:', appId);
        console.error('오류 발생:', error.message);
      }
    }
  }

  async getOwnedGames(id: string) {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${settings.api.steam}&steamid=${id}`;
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(url)
          .pipe(map((response: AxiosResponse) => response.data)),
      );
      const games = response.response.games;
      // console.log(games);
      return games;
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.error(
          '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      } else {
        console.error('오류 발생:', error.message);
      }
    }
  }

  async getPlaytimeInfo(gamelist) {
    const totalPlaytime = gamelist.reduce((total, game) => {
      return total + game.playtime_forever;
    }, 0);

    const minimumWagePerHour = 10030; // 10,030원 (2024년 기준 한국 최저임금)
    const sleepHoursPerDay = 8; // 평균적으로 하루에 자는 시간 (시간 단위)

    const sleepMinutesPerDay = sleepHoursPerDay * 60;

    const seoulToBusanKm = 325;
    const seoulToNewYorkKm = 11000;

    // 평균 이동 속도 (예: 자동차의 평균 속도)
    const travelSpeedKmPerHour = 100;

    // 총 플레이 시간을 시간 단위로 환산
    const totalPlaytimeInHours = totalPlaytime / 60;

    // 서울에서 부산까지 몇 번 이동할 수 있는지 계산
    const totalTravelDistanceKm = totalPlaytimeInHours * travelSpeedKmPerHour;
    const busanTrips = Math.floor(totalTravelDistanceKm / seoulToBusanKm);

    // 서울에서 뉴욕까지 몇 번 이동할 수 있는지 계산
    const newYorkTrips = Math.floor(totalTravelDistanceKm / seoulToNewYorkKm);

    const formatCurrency = (amount: number) => {
      return amount.toLocaleString('ko-KR') + '원'; // 한국 원화 형식으로 포맷
    };
    return {
      playtime: {
        totalPlaytime,
        totalPlaytimeInHours: Math.floor(totalPlaytime / 60) + '시간',
        jajangCount: Math.floor(totalPlaytime / 3) + '개의 3분 짜장',
        totalEarnings:
          formatCurrency(
            Math.floor((totalPlaytime / 60) * minimumWagePerHour),
          ) + '(2024년 최저임금기준)',
        sleepCount:
          Math.floor(totalPlaytime / sleepMinutesPerDay) + '번의 수면',
        soeulToBusanTrips: busanTrips + '번의 서울-부산 이동',
        soeulToNewYorkTrips: newYorkTrips + '번의 서울-뉴욕 이동',
      },
    };
  }
  catch(error) {
    if (error.response && error.response.status === 500) {
      console.error(
        '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    } else {
      console.error('오류 발생:', error.message);
    }
  }

  async getScrapData(id: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--disable-features=UseDBus',
        '--ignore-certificate-errors', // SSL 오류 무시
      ],
      executablePath:
        process.env.NODE_ENV === 'development'
          ? undefined
          : '/usr/bin/google-chrome-stable',
      // executablePath: '/usr/bin/google-chrome-stable',
      ignoreHTTPSErrors: true, // 추가: HTTPS 오류 무시
    });

    const page = await browser.newPage();
    try {
      await page.goto(`https://steamcommunity.com/profiles/${id}`, {});

      const levelSelector =
        '#responsive_page_template_content > div.no_header.profile_page > div.profile_header_bg > div > div > div > div.profile_header_badgeinfo > div.profile_header_badgeinfo_badge_area > a > div > div > span';

      // 해당 요소에서 레벨 데이터 추출
      const level = await page.$eval(
        levelSelector,
        (element) => element.innerText,
      );

      const headers = {
        level,
        profileId: id,
      };

      return headers; // 추출한 데이터를 반환
    } catch (error) {
      console.error('Error scraping data:', error);
      return null; // 오류 발생 시 null 반환
    } finally {
      await browser.close(); // 브라우저 종료
    }
  }

  async getUserStat(id: string) {
    const url = `https://steamladder.com/api/v1/profile/${id}`;

    try {
      const headers = {
        Authorization: `Token ${settings.api.steamLadder}`,
      };
      const response = await firstValueFrom(
        this.httpService
          .get(url, { headers })
          .pipe(map((response: AxiosResponse) => response.data)),
      );
      console.log(response);

      const user = response.steam_stats;
      const stats = user;
      const games = user.games;
      const totalPlaytime = games.total_playtime_min;

      const minimumWagePerHour = 10030; // 2024년 기준 한국 최저임금
      const sleepHoursPerDay = 8; // 평균적으로 하루에 자는 시간 (시간 단위)
      const sleepMinutesPerDay = sleepHoursPerDay * 60;
      const seoulToBusanKm = 325;
      const seoulToNewYorkKm = 11000;
      const travelSpeedKmPerHour = 100;

      // 총 플레이 시간을 시간 단위로 환산
      const totalPlaytimeInHours = totalPlaytime / 60;

      // 서울에서 부산까지 몇 번 이동할 수 있는지 계산
      const totalTravelDistanceKm = totalPlaytimeInHours * travelSpeedKmPerHour;
      const busanTrips = Math.floor(totalTravelDistanceKm / seoulToBusanKm);

      // 서울에서 뉴욕까지 몇 번 이동할 수 있는지 계산
      const newYorkTrips = Math.floor(totalTravelDistanceKm / seoulToNewYorkKm);

      // 통화 포맷 함수
      const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ko-KR') + '원'; // 한국 원화 형식으로 포맷
      };

      return {
        // steamJoinDate: user.steam_user.steam_join_date,
        // countryCode: user.steam_user.steam_country_code || null,
        lastUpdate: stats.last_update,
        level: stats.level,
        // 1, 5, 10, 25, 50, 100, 250, 500, 1k, 2000, 3000, 4000
        badges: `https://community.akamai.steamstatic.com/public/images/badges/13_gamecollector/50_80.png?v=4`,
        xp: stats.xp,
        friends: stats.friends,
        totalGames: games.total_games,
        playtime: {
          totalPlaytime,
          totalPlaytimeInHours: `${Math.floor(totalPlaytime / 60)}시간`,
          jajangCount: `${Math.floor(totalPlaytime / 3)}개의 3분 짜장`,
          totalEarnings: `${formatCurrency(Math.floor((totalPlaytime / 60) * minimumWagePerHour))} (2024년 최저임금기준)`,
          sleepCount: `${Math.floor(totalPlaytime / sleepMinutesPerDay)}번의 수면`,
          seoulToBusanTrips: `${busanTrips}번의 서울-부산 이동`,
          seoulToNewYorkTrips: `${newYorkTrips}번의 서울-뉴욕 이동`,
        },
        mostPlayed: games.most_played,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response && error.response.status === 500) {
      console.error(
        '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    } else {
      console.error('오류 발생:', error.message);
    }
  }
}

// async calculateUserStat()

//   async getUserStat(id: string) {
//     const url = `https://steamladder.com/api/v1/profile/${id}`;

//     console.log('실행0');
//     try {
//       console.log(url);
//       const headers = {
//         Authorization: `Token ${settings.api.steamLadder}`,
//       };
//       const response = await firstValueFrom(
//         this.httpService
//           .get(url, { headers }) // URL과 헤더 설정
//           .pipe(map((response: AxiosResponse) => response.data)),
//       );
//       const responses = response;
//       console.log('실행1');
//       console.log('responses', responses);

//       console.log('실행2');
//       const user = response.steam_stats;
//       const stats = response.steam_stats;
//       const games = response.steam_stats.games;
//       // console.log('games', games);
//       // console.log('stat', stats);
//       // console.log('user', user);
//       const mostPlayed = response.steam_stats.games.most_played;
//       const totalPlaytime = games.total_playtime_min;

//       console.log(totalPlaytime);
//       console.log('mostPlayed', mostPlayed);

//       // const stat = {
//       //   steamJoinDate: response.steam_user.steam_join_date,
//       //   countryCode: response.steam_user.steam_country_code || null,
//       //   lastUpdate: stats.last_update,
//       //   level: stats.level,
//       //   xp: stats.xp,
//       //   friends: stats.friends,
//       // };
//       // console.log(stat);
//       // const game = {
//       //   totalPlayetime: games.total_playtime_min,
//       //   mostPlayed: games.most_played,
//       // };

//       const minimumWagePerHour = 10030; // 10,030원 (2024년 기준 한국 최저임금)
//       const sleepHoursPerDay = 8; // 평균적으로 하루에 자는 시간 (시간 단위)

//       const sleepMinutesPerDay = sleepHoursPerDay * 60;

//       const seoulToBusanKm = 325;
//       const seoulToNewYorkKm = 11000;

//       // 평균 이동 속도 (예: 자동차의 평균 속도)
//       const travelSpeedKmPerHour = 100;

//       // 총 플레이 시간을 시간 단위로 환산
//       const totalPlaytimeInHours = totalPlaytime / 60;

//       // 서울에서 부산까지 몇 번 이동할 수 있는지 계산
//       const totalTravelDistanceKm = totalPlaytimeInHours * travelSpeedKmPerHour;
//       const busanTrips = Math.floor(totalTravelDistanceKm / seoulToBusanKm);

//       // 서울에서 뉴욕까지 몇 번 이동할 수 있는지 계산
//       const newYorkTrips = Math.floor(totalTravelDistanceKm / seoulToNewYorkKm);

//       const formatCurrency = (amount: number) => {
//         return amount.toLocaleString('ko-KR') + '원'; // 한국 원화 형식으로 포맷
//       };
//       return {
//         steamJoinDate: response.steam_user.steam_join_date,
//         countryCode: response.steam_user.steam_country_code || null,
//         lastUpdate: stats.last_update,
//         level: stats.level,
//         xp: stats.xp,
//         friends: stats.friends,
//         totalGames: games.total_games,
//         playtime: {
//           totalPlaytime,
//           totalPlaytimeInHours: Math.floor(totalPlaytime / 60) + '시간',
//           jajangCount: Math.floor(totalPlaytime / 3) + '개의 3분 짜장',
//           totalEarnings:
//             formatCurrency(
//               Math.floor((totalPlaytime / 60) * minimumWagePerHour),
//             ) + '(2024년 최저임금기준)',
//           sleepCount:
//             Math.floor(totalPlaytime / sleepMinutesPerDay) + '번의 수면',
//           soeulToBusanTrips: busanTrips + '번의 서울-부산 이동',
//           soeulToNewYorkTrips: newYorkTrips + '번의 서울-뉴욕 이동',
//         },
//         mostPlayed: games.most_played,
//       };
//     } catch (error) {
//       if (error.response && error.response.status === 500) {
//         console.error(
//           '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
//         );
//       } else {
//         console.error('오류 발생:', error.message);
//       }
//     }
//     // const games = response.steam_stats.games.map((game) => ({
//     //   appId: game.appid,
//     //   playtime: game.playtime_forever,
//     //   lastPlayed: game.rtime_last_played,
//     // }));
//     // const gamesCount = response.game_count;

//     // console.log(rank);

//     // return response.steam_stats;
//   }
// }

// //   async searchUser(userName: string) {
// //     const url = `https://steamcommunity.com/search/users#text=${userName}`;
// //   }
// // }

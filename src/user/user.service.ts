import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import config from 'src/config/configuration';

const settings = config();

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async getPlayerSummaries(id: string) {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${settings.api.steam}&steamids=${id}`;
    try {
      console.log(url);
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
    const url = `https://api.steampowered.com/ISteamEconomy/GetAssetPrices/v1/?key=${settings.api.steam}&appid=${appId}&currency=KRW&language=korean`;
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(url)
          .pipe(map((response: AxiosResponse) => response.data)),
      );
      console.log(url);
      console.log(response);
      return response;
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

  // async getOwnedGames(id: string) {
  //   const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${settings.api.steam}&steamid=${id}`;
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService
  //         .get(url)
  //         .pipe(map((response: AxiosResponse) => response.data)),
  //     );

  //     const games = response.response.games;

  //     const gamesWithPrices = await Promise.all(
  //       games.map(async (game) => {
  //         console.log(game.appid);
  //         // const priceData = await this.getGamePrice(game.appid);
  //         // return {
  //         //   appId: game.appid,
  //         //   playtime: game.playtime_forever,
  //         //   lastPlayed: game.rtime_last_played,
  //         //   price: priceData, // 필요한 경우 가격 정보의 특정 필드를 추출하세요.
  //         // };
  //       }),
  //     );

  //     // 가격 합산
  //     // const totalPrice = gamesWithPrices.reduce(
  //     //   (sum, game) => sum + game.totalPrice,
  //     //   0,
  //     // );

  //     // console.log('Total Price: ', totalPrice);
  //     const filteredData = response.response.games.map((game) => ({
  //       appId: game.appid,
  //       playtime: game.playtime_forever,
  //       lastPlayed: game.rtime_last_played,
  //     }));

  //     const gamesCount = response.game_count;

  //     return {
  //       gamesCount,
  //       // totalPrice,
  //       games: filteredData,
  //       // gamesWithPrices,
  //     };
  //   } catch (error) {
  //     if (error.response && error.response.status === 500) {
  //       console.error(
  //         '서버에서 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  //       );
  //     } else {
  //       console.error('오류 발생:', error.message);
  //     }
  //   }
  // }

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

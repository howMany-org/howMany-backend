import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import config from 'src/config/configuration';

const settings = config();

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async validateUser(profile: any): Promise<any> {
    return profile;
  }

  async getPlayerSummaries(id: string) {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${settings.api.steam}&steamids=${id}`;
    console.log(url);

    console.log('실행');
    return await firstValueFrom(
      this.httpService
        .get(url)
        .pipe(map((response: AxiosResponse) => response.data)),
    );
  }

  async getOwnedGames(id: string) {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${settings.api.steam}&steamid=${id}`;
    console.log('실행');

    console.log(url);
    return await firstValueFrom(
      this.httpService
        .get(url)
        .pipe(map((response: AxiosResponse) => response.data)),
    );
  }

  async getUserRank(id: string) {
    //steamladder.com/api/v1/profile/76561199115107502
    const url = `https://steamladder.com/api/v1/profile/${id}`;
    const headers = {
      Authorization: `Token ${settings.api.steamLadder}`,
    };

    const rank = await firstValueFrom(
      this.httpService
        .get(url, { headers }) // URL과 헤더 설정
        .pipe(map((response: AxiosResponse) => response.data)),
    );
    console.log(rank);
    return rank;
  }

  async searchUser(userName: string) {
    const url = `https://steamcommunity.com/search/users#text=${userName}`;
  }
}

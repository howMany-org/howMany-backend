import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async validateUser(profile: any): Promise<any> {
    return profile;
  }

  async getPlayerSummaries(id: string) {
    // const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${id}`;
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F54679E32A24913085FBAB4FDBE475ED&steamids=76561199115107502`;
    return await firstValueFrom(
      this.httpService
        .get(url)
        .pipe(map((response: AxiosResponse) => response.data)),
    );
  }

  async getOwnedGames(id: string) {
    // const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${id}`;
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F54679E32A24913085FBAB4FDBE475ED&steamid=76561199115107502`;

    return await firstValueFrom(
      this.httpService
        .get(url)
        .pipe(map((response: AxiosResponse) => response.data)),
    );
  }

  async searchUser(userName: string) {
    const url = `https://steamcommunity.com/search/users#text=${userName}`;
  }
}

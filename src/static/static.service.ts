import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';

import config from '../config/configuration'; // 설정 모듈 불러오기
import {
  MostPlayedDto,
  TopGamesOwnerDto,
  TopPlayTimeUserDto,
  TopSellerDto,
} from './dto/static.dto';

const settings = config(); // 설정 파일 로드

@Injectable()
export class StaticService {
  private readonly logger = new Logger(StaticService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly httpService: HttpService,
  ) {}

  async getMostPlayedCharts(limit: number): Promise<MostPlayedDto[]> {
    try {
      // 캐시에서 데이터 가져오기
      const cachedCharts = await this.cacheService.get('mostPlayedCharts');
      const charts: MostPlayedDto[] = JSON.parse(cachedCharts);

      // 차트 항목 개수를 필터링
      return charts.slice(0, limit);
    } catch (error) {
      console.error('Steam API 요청 실패:', error);
      throw error;
    }
  }

  async getTopSellerCharts(
    limit: number,
    region: string,
  ): Promise<TopSellerDto[]> {
    try {
      //캐시에서 데이터 가져오기
      const cachedCharts = await this.cacheService.get(
        `topSellerCharts:${region}`,
      );
      const charts: TopSellerDto[] = JSON.parse(cachedCharts);

      // 차트 항목 개수를 필터링
      return charts.slice(0, limit);
    } catch (error) {
      this.logger.error(
        `Error fetching top seller charts for ${region} from cache:`,
        error.message,
      );
      throw error;
    }
  }

  async getTopPlaytimeUser(
    limit: number,
    regionOrCountryCode?: string,
  ): Promise<TopPlayTimeUserDto[]> {
    try {
      let url = `https://steamladder.com/api/v1/ladder/playtime`;
      if (regionOrCountryCode) {
        url += `/${regionOrCountryCode}`;
      }
      const headers = {
        Authorization: `Token ${settings.api.steamLadder}`,
      };

      const response = await firstValueFrom(
        this.httpService
          .get(url, { headers }) // URL과 헤더 설정
          .pipe(map((response: AxiosResponse) => response.data)),
      );
      // 필요한 정보만 필터링

      const filteredData = response.ladder.map((item) => ({
        rank: parseInt(item.pos) + 1,
        userInfo: {
          steamName: item.steam_user.steam_name,
          steamId: item.steam_user.steam_id,
          countryCode: item.steam_user.steam_country_code,
          steamAvatarUrl: item.steam_user.steam_avatar_src,
        },
        totalPlaytime: item.steam_stats.games.total_playtime_min,
      }));

      // 차트 항목 개수를 필터링
      return filteredData.slice(0, limit);
    } catch (error) {
      console.error('Steam API 요청 실패:', error);
      throw error;
    }
  }

  async getTopGamesOwner(
    limit: number,
    regionOrCountryCode?: string,
  ): Promise<TopGamesOwnerDto[]> {
    try {
      let url = `https://steamladder.com/api/v1/ladder/games`;
      if (regionOrCountryCode) {
        url += `/${regionOrCountryCode}`;
      }
      const headers = {
        Authorization: `Token ${settings.api.steamLadder}`,
      };

      const response = await firstValueFrom(
        this.httpService
          .get(url, { headers }) // URL과 헤더 설정
          .pipe(map((response: AxiosResponse) => response.data)),
      );
      // 필요한 정보만 필터링
      const filteredData = response.ladder.map((item) => ({
        rank: parseInt(item.pos) + 1,
        userInfo: {
          steamName: item.steam_user.steam_name,
          steamId: item.steam_user.steam_id,
          countryCode: item.steam_user.steam_country_code,
          steamAvatarUrl: item.steam_user.steam_avatar_src,
        },
        totalGames: item.steam_stats.games.total_games,
      }));

      // 차트 항목 개수를 필터링
      return filteredData.slice(0, limit);
    } catch (error) {
      this.logger.error('Steam API 요청 실패:', error.message);
      throw error;
    }
  }

  async getBroadcasts(): Promise<{ cachedCharts: string }> {
    try {
      //캐시에서 데이터 가져오기
      const cachedCharts = await this.cacheService.get(`broadcasts`);
      return JSON.parse(cachedCharts);
    } catch (error) {
      this.logger.error(`Error fetching broadcasts from cache:`, error.message);
      throw error;
    }
  }
}

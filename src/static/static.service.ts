import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';

import config from '../config/configuration'; // 설정 모듈 불러오기

const settings = config(); // 설정 파일 로드

@Injectable()
export class StaticService {
  private readonly logger = new Logger(StaticService.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly httpService: HttpService,
  ) {}

  async getMostPlayedCharts(): Promise<{ cachedCharts: string }> {
    try {
      //캐시에서 데이터 가져오기
      const cachedCharts = await this.cacheService.get('mostPlayedCharts');
      this.logger.debug('Returning cached most played charts data');

      return JSON.parse(cachedCharts);
    } catch (error) {
      console.error('Steam API 요청 실패:', error);
      throw error;
    }
  }

  async getTopSellerCharts(region: string): Promise<{ cachedCharts: string }> {
    try {
      //캐시에서 데이터 가져오기
      const cachedCharts = await this.cacheService.get(
        `topSellerCharts:${region}`,
      );
      this.logger.debug(
        `Returning cached top seller charts for ${region} data`,
      );

      return JSON.parse(cachedCharts);
    } catch (error) {
      console.error('Steam API 요청 실패:', error);
      throw error;
    }
  }

  async getTopPlaytimeUser(
    regionOrCountryCode?: string,
  ): Promise<{ Charts: string }> {
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

      return response;
    } catch (error) {
      console.error('Steam API 요청 실패:', error);
      throw error;
    }
  }

  async getTopGamesOwner(regionOrCountryCode?: string): Promise<any> {
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
      return response;
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

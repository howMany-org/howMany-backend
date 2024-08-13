import { Controller, Get } from '@nestjs/common';
import { CacheService } from './cache.service'; // 경로를 맞게 수정

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('inspect')
  async inspectCache() {
    const allCacheData = this.cacheService.getAll();
    return allCacheData;
  }
}

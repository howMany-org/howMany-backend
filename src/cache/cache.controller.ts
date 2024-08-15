import { Controller, Get } from '@nestjs/common';
import { CacheService } from './cache.service'; // 경로를 맞게 수정
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('cache')
@ApiTags('(backend 테스트용) cache API')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @ApiOperation({
    summary: 'getOverview API',
    description: '캐시 메모리에 저장된 모든 데이터를 가져오는 api',
  })
  @Get('overview')
  async inspectCache() {
    const allCacheData = this.cacheService.getAll();
    return allCacheData;
  }
}

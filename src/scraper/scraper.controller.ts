import { ScraperService } from './scraper.service';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  BroadcastsDto,
  MostPlayedDto,
  TopSellerDto,
} from 'src/static/dto/static.dto';

@Controller('api/v1/scraper') // v1 버전을 포함한 경로
@ApiTags('(backend 테스트용) scraper API')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  //당일최다접속게임
  @ApiOperation({
    summary: 'scrapMostPlayed API',
    description: 'MostPlayed 차트를 스크랩해오는 api',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiOkResponse({
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        charts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rank: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Counter-Strike 2' },
              price: { type: 'string', example: 'Free To Play' },
              currentPlayers: { type: 'string', example: '867,766' },
              peakPlayers: { type: 'string', example: '1,313,419' },
              imageUrl: {
                type: 'string',
                example:
                  'https://shared.akamai.steamstatic.com//store_item_assets/steam/apps/730/capsule_231x87.jpg?t=1719426374',
              },
            },
          },
        },
      },
    },
  })
  @Get('most-played')
  async scrapMostPlayed(): Promise<MostPlayedDto[]> {
    const charts = await this.scraperService.scrapMostPlayedCharts();
    return charts;
  }

  //topseller게임
  @ApiOperation({
    summary: 'scrapTopSeller API',
    description: 'TopSeller 차트를 스크랩해오는 api',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        charts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rank: { type: 'number', example: 9 },
              name: { type: 'string', example: 'Dead by Daylight' },
              price: { type: 'string', example: '-60%\n₩ 21,500\n₩ 8,600' },
              change: { type: 'string', example: '▲ 17' },
              weeks: { type: 'string', example: '376' },
              imageUrl: {
                type: 'string',
                example:
                  'https://shared.akamai.steamstatic.com//store_item_assets/steam/apps/381210/capsule_231x87.jpg?t=1721927210',
              },
            },
          },
        },
      },
    },
  })
  @ApiQuery({
    name: 'region',
    description: 'Top Seller 차트를 가져올 지역 (예: KR, US, JP, CN, global)',
    required: true,
    type: 'string',
  })
  @Get('top-seller')
  async scrapTopSeller(
    @Query('region') region: string,
  ): Promise<TopSellerDto[]> {
    const charts = await this.scraperService.scrapTopSellerCharts(region);
    return charts;
  }

  @Get('broadcasts')
  async scrapBroadcasts(): Promise<BroadcastsDto[]> {
    const broadcasts = await this.scraperService.scrapBroadcasts();
    return broadcasts;
  }
}

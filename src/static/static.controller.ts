import { StaticService } from './static.service';
import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  MostPlayedDto,
  TopGamesOwnerDto,
  TopPlayTimeUserDto,
  TopSellerDto,
} from './dto/static.dto';
import { LimitQueryDto } from './dto/\blimitQuery.dto';

@Controller('api/v1/static')
@ApiTags('static API')
export class StaticContoller {
  constructor(private readonly staticService: StaticService) {}

  //당일최다접속게임
  @ApiOperation({
    summary: 'getMostPlayed API',
    description:
      'MostPlayed 차트 100개를 불러오는 API, 15분마다 업데이트 (예: 06:00, 06:15, 06:30 등)',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiOkResponse({
    description: 'OK',
    type: MostPlayedDto,
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 차트 항목의 개수 (기본값: 10, 최소값: 1, 최대값: 100)',
    required: false,
    type: 'number',
  })
  @Get('most-played')
  async getMostPlayed(@Query() query: LimitQueryDto): Promise<MostPlayedDto[]> {
    const limit = query.limit || 10; // 기본값 10 설정
    return await this.staticService.getMostPlayedCharts(limit);
  }

  //topseller게임
  @ApiOperation({
    summary: 'getTopSeller API',
    description:
      'TopSeller 차트 100개를 불러오는 API, 하루마다 00:00에 업데이트',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'OK',
    type: TopSellerDto,
  })
  @ApiQuery({
    name: 'region',
    description:
      'TopSeller 차트를 가져올 지역 (예: KR, US, JP, CN, global) 기본값: global',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 차트 항목의 개수 (기본값: 10, 최소값: 1, 최대값: 100)',
    required: false,
    type: 'number',
  })
  @Get('top-seller')
  async TopSeller(
    @Query() query: LimitQueryDto,
    @Query('region') region: string = 'global',
  ): Promise<TopSellerDto[]> {
    const limit = query.limit || 10; // 기본값 10 설정
    return await this.staticService.getTopSellerCharts(limit, region);
  }

  //topPlayTime사용자
  @ApiOperation({
    summary: 'topPlayTimeUser API',
    description: 'TopPlayTimeUser 차트를 불러오는 API',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'OK',
    type: TopPlayTimeUserDto, // DTO를 사용하여 응답 타입을 명시합니다.
  })
  @ApiQuery({
    name: 'regionOrCountryCode',
    description:
      'topPlayTimeUser 차트를 가져올 국가 (예: kr, us, jp, cn) 혹은 지역 (예: europe, asia, africa), 미입력시 전세계의 통계를 불러옴',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 차트 항목의 개수 (기본값: 10, 최소값: 1, 최대값: 100)',
    required: false,
    type: 'number',
  })
  @Get('top-playtime-user')
  async getTopPlaytimeUser(
    @Query() query: LimitQueryDto,
    @Query('regionOrCountryCode') regionOrCountryCode?: string,
  ): Promise<TopPlayTimeUserDto[]> {
    const limit = query.limit || 10; // 기본값 10 설정
    return await this.staticService.getTopPlaytimeUser(
      limit,
      regionOrCountryCode,
    );
  }

  //topGamesOwner
  @ApiOperation({
    summary: 'topGamesOwner API',
    description: 'TopGamesOwner 차트를 불러오는 API',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'OK',
    type: TopGamesOwnerDto,
  })
  @ApiQuery({
    name: 'regionOrCountryCode',
    description:
      'TopGamesOwner 차트를 가져올 국가 (예: kr, us, jp, cn) 혹은 지역 (예: europe, asia, africa), 미입력시 전세계의 통계를 불러옴',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 차트 항목의 개수 (기본값: 10, 최소값: 1, 최대값: 100)',
    required: false,
    type: 'number',
  })
  @Get('top-games-owner')
  async getTopGamesOwner(
    @Query() query: LimitQueryDto,
    @Query('regionOrCountryCode') regionOrCountryCode?: string,
  ): Promise<TopGamesOwnerDto[]> {
    const limit = query.limit || 10; // 기본값 10 설정
    return await this.staticService.getTopGamesOwner(
      limit,
      regionOrCountryCode,
    );
  }

  @ApiOperation({
    summary: 'broadcasts API',
    description: '현재 방송정보를 가져오는 API',
  })
  @ApiOkResponse({
    status: 200,
    description: 'OK',
    type: TopGamesOwnerDto,
  })
  @ApiQuery({
    name: 'limit',
    description: '가져올 방송목록의 개수 (기본값: 10, 최소값: 1, 최대값: 10)',
    required: false,
    type: 'number',
  })
  @Get('broadcasts')
  async getBroadcasts(@Query() query: LimitQueryDto) {
    return await this.staticService.getBroadcasts();
  }
}

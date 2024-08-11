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

@Controller('api/v1/static')
@ApiTags('static API')
export class StaticContoller {
  constructor(private readonly staticService: StaticService) {}

  //당일최다접속게임
  @ApiOperation({
    summary: 'getMostPlayed API',
    description:
      'MostPlayed 차트를 불러오는 API, 15분마다 업데이트 (예: 06:00, 06:15, 06:30 등)',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiOkResponse({
    description: 'OK',
    type: MostPlayedDto, // DTO를 참조합니다.
  })
  @Get('most-played')
  async scrapMostPlayed() {
    return await this.staticService.getMostPlayedCharts();
  }

  //topseller게임
  @ApiOperation({
    summary: 'getTopSeller API',
    description: 'TopSeller 차트를 불러오는 api, 하루마다 00:00에 업데이트',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'OK',
    type: TopSellerDto, // DTO를 참조합니다.
  })
  @ApiQuery({
    name: 'region',
    description: 'TopSeller 차트를 가져올 지역 (예: KR, US, JP, CN)',
    required: true,
    type: 'string',
  })
  @Get('top-seller')
  async scrapTopSeller(@Query('region') region: string) {
    return await this.staticService.getTopSellerCharts(region);
  }

  //topPlayTime사용자
  @ApiOperation({
    summary: 'topPlayTimeUser API',
    description: 'TopPlayTimeUser 차트를 불러오는 api',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'OK',
    type: TopPlayTimeUserDto, // DTO를 사용하여 응답 타입을 명시합니다.
  })
  @ApiQuery({
    name: 'region-or-country-code',
    description:
      'topPlayTimeUse 차트를 가져올 국가 (예: kr, us, jp, cn) 혹은 지역 (예: europe, north_america, south_america, asia, africa, oceania, antarctica)',
    required: false,
    type: 'string',
  })
  @Get('top-playtime-user')
  async getTopPlaytimeUser(
    @Query('regionOrCountryCode') regionOrCountryCode?: string,
  ) {
    return await this.staticService.getTopPlaytimeUser(regionOrCountryCode);
  }

  //topGamesOwner사용자
  @ApiOperation({
    summary: 'topGamesOwner API',
    description: 'TopGamesOwner 차트를 불러오는 api',
  })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiOkResponse({
    description: 'OK',
    type: TopGamesOwnerDto, // DTO를 사용하여 응답 타입을 명시합니다.
  })
  @ApiQuery({
    name: 'regionOrCountryCode',
    description:
      'TopGamesOwner 차트를 가져올 국가 (예: kr, us, jp, cn) 혹은 지역 (예: europe, north_america, south_america, asia, africa, oceania, antarctica)',
    required: false,
    type: 'string',
  })
  @Get('top-games-owner')
  async getTopGamesOwner(
    @Query('regionOrCountryCode') regionOrCountryCode?: string,
  ) {
    return await this.staticService.getTopGamesOwner(regionOrCountryCode);
  }
}

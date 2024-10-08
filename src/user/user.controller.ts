import {
  Get,
  Query,
  Controller,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express'; // express의 Response와 Request를 import합니다.
import { UserService } from './user.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileDto } from './dto/\bprofile.dto';

@Controller('api/v1/user')
@ApiTags('user API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 사용자 프로필 조회
  @ApiOperation({
    summary: 'getUserProfile API',
    description: '사용자의 프로필 정보와 소유 게임 목록을 조회하는 API',
  })
  @ApiOkResponse({
    description: 'OK',
    type: ProfileDto,
  })
  @ApiQuery({
    name: 'id',
    description: 'user의 id정보',
    required: true,
    type: 'string',
  })
  @Get('profile')
  async getProfile(@Query('id') id: string) {
    try {
      const user = await this.userService.getPlayerSummaries(id);
      const gamelist = await this.userService.getOwnedGames(id);
      const totalPlayetime = await this.userService.getPlaytimeInfo(gamelist);

      const totalPrice = await gamelist.reduce(
        async (totalPricePromise, game) => {
          const totalPrice = await totalPricePromise; // 이전 가격을 기다림
          const price = await this.userService.getGamePrice(game.appid); // 가격을 비동기적으로 가져옴
          return totalPrice + price; // 누적된 가격 반환
        },
        Promise.resolve(0),
      );

      return {
        user,
        totalPlayetime,
        totalGamesCount: gamelist.length,
        totalPrice,
        gamelist,
      };
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw new InternalServerErrorException('Failed to fetch profile data');
    }
  }

  // // 사용자 정보 스크래핑
  // @Get('scrapData')
  // async getUserScrapData(@Query('id') id: string) {
  //   const level = await this.userService.getScrapData(id);
  //   return level;
  // }

  // 사용자 정보 스크래핑
  @Get('level')
  async getUserLevel(@Query('id') id: string) {
    const level = await this.userService.getScrapData(id);
    return level;
  }

  //사용자 검색
  @Get('search')
  async serchUser(@Res() res: Response) {
    // const search = await this.steamService.searchUser;
  }
}

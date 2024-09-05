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

  // 사용자 정보 및 게임 정보 조회
  @ApiOperation({
    summary: 'getUserInfo API',
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
      console.log('User data:', user);
      // const games = await this.userService.getOwnedGames(id);
      // console.log('Games data:', games);
      const stat = await this.userService.getUserStat(id);
      console.log('Stat data:', stat);
      return { user, stat };
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw new InternalServerErrorException('Failed to fetch profile data');
    }
  }

  // 사용자 정보 및 게임 정보 조회
  @ApiOperation({
    summary: 'getUserInfo API',
    description: '사용자의 rank 정보를 불러오는 API',
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
  @Get('stat')
  async getUserRank(@Query('id') id: string) {
    const stat = await this.userService.getUserStat(id);

    return { stat };
  }

  //사용자 검색
  @Get('search')
  async serchUser(@Res() res: Response) {
    // const search = await this.steamService.searchUser;
  }
}

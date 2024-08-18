import { Get, Res, Req, Query, UseGuards, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
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

  @ApiOperation({
    summary: '로그인 API',
    description: '스팀 auth를 이용한 로그인',
  })
  @Get('login')
  @UseGuards(AuthGuard('steam'))
  async steamLogin() {
    // Passport가 자동으로 리디렉션합니다.
  }

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
    const user = await this.userService.getPlayerSummaries(id);
    const games = await this.userService.getOwnedGames(id);

    return { user, games };
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
  @Get('rank')
  async getUserRank(@Query('id') id: string) {
    const ranks = await this.userService.getUserRank(id);

    return { ranks };
  }
}

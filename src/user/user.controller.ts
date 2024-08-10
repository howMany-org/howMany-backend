import { Get, Res, Req, Query, UseGuards, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api/v1/user')
@ApiTags('user API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '로그인 API',
    description: '스팀 auth를 이용한 로그인',
  })
  @ApiCreatedResponse({ description: '사용자 생성 완료' })
  @ApiConflictResponse({ description: '중복된 항목이 존재' })
  @Get('login')
  @UseGuards(AuthGuard('steam'))
  async steamLogin() {
    // Passport가 자동으로 리디렉션합니다.
  }

  @Get('return')
  @UseGuards(AuthGuard('steam'))
  steamReturn(@Req() req: Request, @Res() res: Response) {
    res.redirect('/steam');
  }

  @Get('')
  root(@Res() res: Response) {
    res.send('Hello World!'); // 기본 라우트 핸들러
  }

  @Get('userinfo')
  async getUserInfo(@Query('id') id: string) {
    const games = await this.userService.getOwnedGames(id);
    const user = await this.userService.getPlayerSummaries(id);
    return { games, user };
  }
}

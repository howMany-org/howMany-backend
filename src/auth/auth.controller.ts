import { Get, UseGuards, Controller, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express'; // express의 Response와 Request를 import합니다.
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
@ApiTags('auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인 API',
    description: '스팀 auth를 이용한 로그인',
  })
  @Get('login')
  @UseGuards(AuthGuard('steam'))
  async steamLogin() {
    // Passport가 자동으로 리디렉션합니다.
  }

  @Get('return')
  @UseGuards(AuthGuard('steam'))
  async return(@Req() req: Request, @Res() res: Response) {
    // const profile = await this.authService.validateUser(req);
    // const steamId = profile.user._json.steamid;
    // console.log(steamId);

    // Steam ID를 쿼리 파라미터로 포함하여 리다이렉트
    res.redirect(`/api/v1/auth/`);
    // res.redirect(`/api/v1/user/profile?id=${steamId}`);
  }

  @Get('')
  root(@Res() res: Response) {
    res.send('mainPage'); // 기본 라우트 핸들러
  }
}

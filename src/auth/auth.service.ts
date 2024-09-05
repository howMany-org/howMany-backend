import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import config from 'src/config/configuration';

const settings = config();

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async validateUser(profile: any): Promise<any> {
    // 사용자 프로필에서 ID 추출
    const steamId = profile.id;
    // console.log('실행');
    // console.log('profile:', profile);
    // console.log('service단 출력:', steamId);

    return profile;
    // 데이터베이스에서 사용자 조회
    // let user = awaist this.userService.findOneBySteamId(steamId);

    // 사용자가 없으면 새로 생성
    // if (!user) {
    //   user = await this.userService.create({
    //     steamId: steamId,
    //     displayName: profile.displayName,
    //     avatar: profile.photos[0].value, // 사용자의 아바타 URL
    //   });
    // }
  }
}

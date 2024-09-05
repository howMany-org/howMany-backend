import { Strategy } from 'passport-steam';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import config from 'src/config/configuration';
import { PassportStrategy } from '@nestjs/passport';
// import { PrismaService } from 'src/prisma/prisma.service';

const settings = config(); // 설정 파일 로드

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    // private prisma: PrismaService,
  ) {
    console.log('API Key:', settings.api.steam); // API 키 출력
    super({
      // returnURL: 'http://13.124.68.217:3000/api/v1/auth/return',
      returnURL: 'http://localhost:3000/api/v1/auth/return',
      // realm: 'http://13.124.68.217:3000/',
      realm: 'http://localhost:3000/',

      apiKey: settings.api.steam,
    });
  }

  async validate(identifier: string, profile: any, done: Function) {
    try {
      // const steamid = profile.id; // Steam ID를 추출
      const userProfile = profile._json;
      console.log('API Key:', settings); // API 키 출력
      console.log('profile:', profile);
      console.log(userProfile.steamid);
      console.log(userProfile.personaname);

      const userInfo = {
        steamId: BigInt(userProfile.steamid), // BigInt로 변환
        steamName: userProfile.personaname, // nickname 대신 steamName 사용
        steamJoinDate: new Date(userProfile.timecreated * 1000),
        avatarHash: userProfile.avatarhash,
      };

      // 사용자 정보를 데이터베이스에 저장하거나 업데이트
      // const user = await this.prisma.user.upsert({
      //   where: { steamId: userInfo.steamId },
      //   update: userInfo,
      //   create: userInfo,
      // });

      // db에 저장하는 로직 추가하기
      // const user = await this.authService.createUse(userCreateInput); // createUser 메서드 호출
      // done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}

// CREATE TABLE users
// (
//   id              SERIAL       NOT NULL ,
//   steam_id        BIGINT       NOT NULL ,
//   steam_name      VARCHAR(50)  NOT NULL ,
//   steam_join_date TIMESTAMP    NOT NULL ,
//   avartar_hash    VARCHAR(255) NULL     ,
//   PRIMARY KEY (id)
// );

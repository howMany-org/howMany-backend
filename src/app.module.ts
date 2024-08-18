import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaticModule } from './static/static.module';
import { ScraperModule } from './scraper/scraper.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MbtiModule } from './mbti/mbti.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/configuration'; // 설정 모듈 불러오기
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    StaticModule,
    ScraperModule,
    MbtiModule,
    UserModule,
  ],
})
export class AppModule {}

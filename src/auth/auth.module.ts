import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SteamStrategy } from './steamStrategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ session: true }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SteamStrategy],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
// import { SteamStrategy } from './steam.strategy';

@Module({
  imports: [HttpModule, PassportModule.register({ session: true })],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

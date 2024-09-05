import { Module } from '@nestjs/common';
import { MbtiController } from './mbti.controller';
import { MbtiService } from './mbti.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MbtiController],
  providers: [MbtiService],
})
export class MbtiModule {}

import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: 'memory', //기본 메모리 캐시 스토어
      ttl: 1500, //기본 TTL (초)
    }),
  ],
  controllers: [CacheController],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheConfigMoudle {}

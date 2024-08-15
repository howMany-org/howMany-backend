import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private readonly memoryData: Record<string, string> = {};

  constructor() {}

  public async get(key: string): Promise<string | null> {
    return this.memoryData[key] || null;
  }

  public async set(key: string, value: string): Promise<void> {
    this.memoryData[key] = value;
  }

  // 전체 캐시 메모리 조회
  public getAll(): Record<string, string> {
    return this.memoryData;
  }
}

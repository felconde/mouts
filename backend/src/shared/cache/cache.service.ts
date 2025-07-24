import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ICacheService } from './cache.interface';

@Injectable()
export class CacheService implements ICacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    await this.cacheManager.set(key, value, ttl * 1000);
  }

  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.cacheManager.store.keys(pattern);
    if (keys.length > 0) {
      await this.cacheManager.store.mdel(...keys);
    }
  }
} 
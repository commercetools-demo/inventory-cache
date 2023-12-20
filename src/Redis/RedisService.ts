import { Config, RedisClient, TRedisClientType } from './RedisClient';
import {
  InitializationState,
  RedisRepository,
  ReservationState,
} from './RedisRepository';

export class RedisService implements RedisRepository {
  private redisClient: TRedisClientType;
  constructor(config: Config) {
    const redisClient = new RedisClient(config);
    this.redisClient = redisClient.getRedisClient();
  }

  private getKey(sku: string, channel: string | undefined): string {
    return `${sku}:${channel || ''}`;
  }
  async reserveItem(
    sku: string,
    channel: string | undefined,
    strQuantity: string | number
  ): Promise<ReservationState> {
    const key = this.getKey(sku, channel);

    const quantity = strQuantity.toString();

    try {
      const result = await this.redisClient.reserveItem(key, quantity);
      return result;
    } catch (error) {
      console.error(`Error executing reserveItem ${key} script:`, error);
      return 'FAILED';
    }
  }

  async initializeItem(
    sku: string,
    channel: string | undefined,
    strQuantity: string | number
  ): Promise<InitializationState> {
    const key = this.getKey(sku, channel);
    const quantity = parseInt(strQuantity.toString(), 10);
    try {
      const quantity = strQuantity.toString();

      const result = await this.redisClient.initializeItem(key, quantity);

      return result;
    } catch (error) {
      console.error(`Error executing initializeItem ${key} script:`, error);
      return 'FAILED';
    }
  }
  async releaseItem(
    sku: string,
    channel: string | undefined,
    strQuantity: string | number
  ): Promise<boolean> {
    const key = this.getKey(sku, channel);
    const quantity = strQuantity.toString();

    try {
      const result = await this.redisClient.releaseItem(key, quantity);
      if (result === 'SUCCESS') {
        return true;
      }
      throw new Error(result);
    } catch (error) {
      console.error(`Error executing releaseItem ${key} script:`, error);
      return false;
    }
  }
  async unstockItem(
    sku: string,
    channel: string | undefined,
    strQuantity: string | number
  ): Promise<boolean> {
    const key = this.getKey(sku, channel);
    const quantity = strQuantity.toString();

    try {
      const result = await this.redisClient.unstockItem(key, quantity);
      if (result === 'SUCCESS') {
        return true;
      }
      throw new Error(result);
    } catch (error) {
      console.error(`Error executing unstockItem ${key} script:`, error);
      return false;
    }
  }
  async restockItem(
    sku: string,
    channel: string | undefined,
    strQuantity: string | number
  ): Promise<boolean> {
    const key = this.getKey(sku, channel);
    const quantity = strQuantity.toString();

    try {
      const result = await this.redisClient.restockItem(key, quantity);
      if (result === 'SUCCESS') {
        return true;
      }
      throw new Error(result);
    } catch (error) {
      console.error(`Error executing restockItem ${key} script:`, error);
      return false;
    }
  }
}

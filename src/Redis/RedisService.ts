import { Config, RedisClient } from './RedisClient';
import {
  InitializationState,
  RedisRepository,
  ReservationState,
} from './RedisRepository';
import { RedisClientType } from 'redis';

export class RedisService implements RedisRepository {
  private redisClient: RedisClientType;
  constructor(config: Config) {
    const redisClient = new RedisClient(config);
    this.redisClient = redisClient.getRedisClient();
  }
  async reserveItem(
    sku: string,
    channel: string,
    strQuantity: string | number
  ): Promise<ReservationState> {
    const key = `${sku}:${channel}`;
    console.log('key', key);

    const quantity = parseInt(strQuantity.toString(), 10);

    try {
      const itemDataJson = await this.redisClient.get(key);
      if (!itemDataJson) {
        return 'DOES_NOT_EXIST';
      }
      const itemData = JSON.parse(itemDataJson);
      const availableQuantity = parseInt(itemData.availableQuantity, 10);
      const reservedQuantity = parseInt(itemData.reservedQuantity, 10);

      if (availableQuantity < quantity || availableQuantity <= 0) {
        return 'FAILED'; // Not enough available quantity
      }
      // Update the quantities
      itemData.availableQuantity = availableQuantity - quantity;
      itemData.reservedQuantity = reservedQuantity + quantity;

      // Save the updated data back to Redis
      await this.redisClient.set(key, JSON.stringify(itemData));

      return 'SUCCESS';
    } catch (e) {
      console.error(e);
      return 'FAILED';
    }
  }

  async initializeItem(
    sku: string,
    channel: string,
    strQuantity: string | number
  ): Promise<InitializationState> {
    const key = `${sku}:${channel}`;
    const quantity = parseInt(strQuantity.toString(), 10);
    try {
      // Check if the item already exists
      const exists = await this.redisClient.exists(key);
      if (exists) {
        return 'ALREADY_EXISTS';
      }

      // Create a JSON object for the item
      const itemData = {
        availableQuantity: quantity,
        initialQuantity: quantity,
        reservedQuantity: 0,
      };

      // Store the JSON string in Redis
      await this.redisClient.set(key, JSON.stringify(itemData));

      return 'SUCCESS';
    } catch (err) {
      console.error(err);
      return 'FAILED';
    }
  }
  releaseItem(
    sku: string,
    channel: string,
    strQuantity: string | number
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  unstockItem(
    sku: string,
    channel: string,
    strQuantity: string | number
  ): void {
    throw new Error('Method not implemented.');
  }
  restockItem(
    sku: string,
    channel: string,
    strQuantity: string | number
  ): void {
    throw new Error('Method not implemented.');
  }
}

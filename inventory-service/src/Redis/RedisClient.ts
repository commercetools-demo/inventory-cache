import { createClient, defineScript } from 'redis';
import { InitializationState, ReservationState } from './RedisRepository';

export interface Config {
  host: string;
  port: number;
}

export interface TRedisClientType extends ReturnType<typeof createClient> {
  releaseItem: (key: string, quantity: string) => Promise<ReservationState>;
  reserveItem: (key: string, quantity: string) => Promise<ReservationState>;
  initializeItem: (
    key: string,
    quantity: string
  ) => Promise<InitializationState>;
  unstockItem: (key: string, quantity: string) => Promise<ReservationState>;
  restockItem: (key: string, quantity: string) => Promise<ReservationState>;
}

export class RedisClient {
  private host: string;
  private port: number;

  constructor(config: Config) {
    this.host = config.host;
    this.port = config.port;
  }

  public getRedisClient(): TRedisClientType {
    const redisClient = createClient({
      socket: {
        host: this.host,
        port: this.port,
      },
      scripts: {
        releaseItem: defineScript({
          NUMBER_OF_KEYS: 1,
          SCRIPT: `
            local key = KEYS[1]
            local quantity = tonumber(ARGV[1])
            local itemDataJson = redis.call('get', key)
            if not itemDataJson then
              return 'DOES_NOT_EXIST'
            end
            local itemData = cjson.decode(itemDataJson)
            if tonumber(itemData.reservedQuantity) >= quantity then
              itemData.availableQuantity = tonumber(itemData.availableQuantity) + quantity
              itemData.reservedQuantity = tonumber(itemData.reservedQuantity) - quantity
              redis.call('set', key, cjson.encode(itemData))
              return 'SUCCESS'
            else
              return 'FAILED'
            end
          `,
          transformArguments(key, quantity) {
            return [key, quantity];
          },
        }),
        reserveItem: defineScript({
          NUMBER_OF_KEYS: 1,
          SCRIPT: `
            local key = KEYS[1]
            local quantity = tonumber(ARGV[1])

            local itemDataJson = redis.call('GET', key)
            if not itemDataJson then
                return 'DOES_NOT_EXIST'
            end

            local itemData = cjson.decode(itemDataJson)
            local availableQuantity = tonumber(itemData.availableQuantity)
            local reservedQuantity = tonumber(itemData.reservedQuantity)

            if availableQuantity < quantity or availableQuantity <= 0 then
                return 'FAILED' -- Not enough available quantity
            end

            -- Update the quantities
            itemData.availableQuantity = availableQuantity - quantity
            itemData.reservedQuantity = reservedQuantity + quantity

            -- Save the updated data back to Redis
            redis.call('SET', key, cjson.encode(itemData))

            return 'SUCCESS'
          `,
          transformArguments(key, quantity) {
            return [key, quantity];
          },
        }),
        initializeItem: defineScript({
          NUMBER_OF_KEYS: 1,
          SCRIPT: `
            local key = KEYS[1]
            local quantity = tonumber(ARGV[1])

            -- Check if the item already exists
            local exists = redis.call('EXISTS', key)
            if exists == 1 then
                return 'ALREADY_EXISTS'
            end

            local itemData = {
              availableQuantity = quantity,
              initialQuantity = quantity,
              reservedQuantity = 0
            }
            redis.call('set', key, cjson.encode(itemData))
            return 'SUCCESS'
          `,
          transformArguments(key, quantity) {
            return [key, quantity];
          },
        }),
        unstockItem: defineScript({
          NUMBER_OF_KEYS: 1,
          SCRIPT: `
            local key = KEYS[1]
            local quantity = tonumber(ARGV[1])
            local itemDataJson = redis.call('get', key)
            if not itemDataJson then
              return 'DOES_NOT_EXIST'
            end
            local itemData = cjson.decode(itemDataJson)
            if tonumber(itemData.reservedQuantity) < quantity then
              return 'FAILED'
            end
            itemData.reservedQuantity = tonumber(itemData.reservedQuantity) - quantity
            redis.call('set', key, cjson.encode(itemData))
            return 'SUCCESS'
          `,
          transformArguments(key, quantity) {
            return [key, quantity];
          },
        }),
        restockItem: defineScript({
          NUMBER_OF_KEYS: 1,
          SCRIPT: `
            local key = KEYS[1]
            local quantity = tonumber(ARGV[1])
            local itemDataJson = redis.call('get', key)
            if not itemDataJson then
              return 'DOES_NOT_EXIST'
            end
            local itemData = cjson.decode(itemDataJson)
            itemData.availableQuantity = tonumber(itemData.availableQuantity) + quantity
            redis.call('set', key, cjson.encode(itemData))
            return 'SUCCESS'
          `,
          transformArguments(key, quantity) {
            return [key, quantity];
          },
        }),
      },
    });
    redisClient.on('error', (err) => console.error('ERR:REDIS:', err));
    redisClient.connect();
    // @ts-ignore
    return redisClient;
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const redis_1 = require("redis");
class RedisClient {
    constructor(config) {
        this.host = config.host;
        this.port = config.port;
    }
    getRedisClient() {
        const redisClient = (0, redis_1.createClient)({
            socket: {
                host: this.host,
                port: this.port,
            },
            scripts: {
                releaseItem: (0, redis_1.defineScript)({
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
                reserveItem: (0, redis_1.defineScript)({
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
                initializeItem: (0, redis_1.defineScript)({
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
                unstockItem: (0, redis_1.defineScript)({
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
                restockItem: (0, redis_1.defineScript)({
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
exports.RedisClient = RedisClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVkaXNDbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvUmVkaXMvUmVkaXNDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW1EO0FBbUJuRCxNQUFhLFdBQVc7SUFJdEIsWUFBWSxNQUFjO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVNLGNBQWM7UUFDbkIsTUFBTSxXQUFXLEdBQUcsSUFBQSxvQkFBWSxFQUFDO1lBQy9CLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2hCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLFdBQVcsRUFBRSxJQUFBLG9CQUFZLEVBQUM7b0JBQ3hCLGNBQWMsRUFBRSxDQUFDO29CQUNqQixNQUFNLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7V0FnQlA7b0JBQ0Qsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFFBQVE7d0JBQzlCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3pCLENBQUM7aUJBQ0YsQ0FBQztnQkFDRixXQUFXLEVBQUUsSUFBQSxvQkFBWSxFQUFDO29CQUN4QixjQUFjLEVBQUUsQ0FBQztvQkFDakIsTUFBTSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBeUJQO29CQUNELGtCQUFrQixDQUFDLEdBQUcsRUFBRSxRQUFRO3dCQUM5QixPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN6QixDQUFDO2lCQUNGLENBQUM7Z0JBQ0YsY0FBYyxFQUFFLElBQUEsb0JBQVksRUFBQztvQkFDM0IsY0FBYyxFQUFFLENBQUM7b0JBQ2pCLE1BQU0sRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FpQlA7b0JBQ0Qsa0JBQWtCLENBQUMsR0FBRyxFQUFFLFFBQVE7d0JBQzlCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3pCLENBQUM7aUJBQ0YsQ0FBQztnQkFDRixXQUFXLEVBQUUsSUFBQSxvQkFBWSxFQUFDO29CQUN4QixjQUFjLEVBQUUsQ0FBQztvQkFDakIsTUFBTSxFQUFFOzs7Ozs7Ozs7Ozs7OztXQWNQO29CQUNELGtCQUFrQixDQUFDLEdBQUcsRUFBRSxRQUFRO3dCQUM5QixPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUN6QixDQUFDO2lCQUNGLENBQUM7Z0JBQ0YsV0FBVyxFQUFFLElBQUEsb0JBQVksRUFBQztvQkFDeEIsY0FBYyxFQUFFLENBQUM7b0JBQ2pCLE1BQU0sRUFBRTs7Ozs7Ozs7Ozs7V0FXUDtvQkFDRCxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsUUFBUTt3QkFDOUIsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDekIsQ0FBQztpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFDSCxXQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuRSxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdEIsYUFBYTtRQUNiLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7Q0FDRjtBQTdJRCxrQ0E2SUMifQ==
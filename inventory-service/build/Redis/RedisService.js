"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const RedisClient_1 = require("./RedisClient");
class RedisService {
    constructor(config) {
        const redisClient = new RedisClient_1.RedisClient(config);
        this.redisClient = redisClient.getRedisClient();
    }
    getKey(sku, channel) {
        return `${sku}:${channel || ''}`;
    }
    reserveItem(sku, channel, strQuantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getKey(sku, channel);
            const quantity = strQuantity.toString();
            try {
                const result = yield this.redisClient.reserveItem(key, quantity);
                return result;
            }
            catch (error) {
                console.error(`Error executing reserveItem ${key} script:`, error);
                return 'FAILED';
            }
        });
    }
    initializeItem(sku, channel, strQuantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getKey(sku, channel);
            const quantity = parseInt(strQuantity.toString(), 10);
            try {
                const quantity = strQuantity.toString();
                const result = yield this.redisClient.initializeItem(key, quantity);
                return result;
            }
            catch (error) {
                console.error(`Error executing initializeItem ${key} script:`, error);
                return 'FAILED';
            }
        });
    }
    releaseItem(sku, channel, strQuantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getKey(sku, channel);
            const quantity = strQuantity.toString();
            try {
                const result = yield this.redisClient.releaseItem(key, quantity);
                if (result === 'SUCCESS') {
                    return true;
                }
                throw new Error(result);
            }
            catch (error) {
                console.error(`Error executing releaseItem ${key} script:`, error);
                return false;
            }
        });
    }
    unstockItem(sku, channel, strQuantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getKey(sku, channel);
            const quantity = strQuantity.toString();
            try {
                const result = yield this.redisClient.unstockItem(key, quantity);
                if (result === 'SUCCESS') {
                    return true;
                }
                throw new Error(result);
            }
            catch (error) {
                console.error(`Error executing unstockItem ${key} script:`, error);
                return false;
            }
        });
    }
    restockItem(sku, channel, strQuantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.getKey(sku, channel);
            const quantity = strQuantity.toString();
            try {
                const result = yield this.redisClient.restockItem(key, quantity);
                if (result === 'SUCCESS') {
                    return true;
                }
                throw new Error(result);
            }
            catch (error) {
                console.error(`Error executing restockItem ${key} script:`, error);
                return false;
            }
        });
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVkaXNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL1JlZGlzL1JlZGlzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwrQ0FBc0U7QUFPdEUsTUFBYSxZQUFZO0lBRXZCLFlBQVksTUFBYztRQUN4QixNQUFNLFdBQVcsR0FBRyxJQUFJLHlCQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVPLE1BQU0sQ0FBQyxHQUFXLEVBQUUsT0FBMkI7UUFDckQsT0FBTyxHQUFHLEdBQUcsSUFBSSxPQUFPLElBQUksRUFBRSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUNLLFdBQVcsQ0FDZixHQUFXLEVBQ1gsT0FBMkIsRUFDM0IsV0FBNEI7O1lBRTVCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXRDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUV4QyxJQUFJO2dCQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLE1BQU0sQ0FBQzthQUNmO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsR0FBRyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ25FLE9BQU8sUUFBUSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQztLQUFBO0lBRUssY0FBYyxDQUNsQixHQUFXLEVBQ1gsT0FBMkIsRUFDM0IsV0FBNEI7O1lBRTVCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEQsSUFBSTtnQkFDRixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRXhDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUVwRSxPQUFPLE1BQU0sQ0FBQzthQUNmO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsR0FBRyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3RFLE9BQU8sUUFBUSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQztLQUFBO0lBQ0ssV0FBVyxDQUNmLEdBQVcsRUFDWCxPQUEyQixFQUMzQixXQUE0Qjs7WUFFNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRXhDLElBQUk7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDeEIsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN6QjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNuRSxPQUFPLEtBQUssQ0FBQzthQUNkO1FBQ0gsQ0FBQztLQUFBO0lBQ0ssV0FBVyxDQUNmLEdBQVcsRUFDWCxPQUEyQixFQUMzQixXQUE0Qjs7WUFFNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRXhDLElBQUk7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDeEIsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN6QjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNuRSxPQUFPLEtBQUssQ0FBQzthQUNkO1FBQ0gsQ0FBQztLQUFBO0lBQ0ssV0FBVyxDQUNmLEdBQVcsRUFDWCxPQUEyQixFQUMzQixXQUE0Qjs7WUFFNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRXhDLElBQUk7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtvQkFDeEIsT0FBTyxJQUFJLENBQUM7aUJBQ2I7Z0JBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN6QjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEdBQUcsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNuRSxPQUFPLEtBQUssQ0FBQzthQUNkO1FBQ0gsQ0FBQztLQUFBO0NBQ0Y7QUF2R0Qsb0NBdUdDIn0=
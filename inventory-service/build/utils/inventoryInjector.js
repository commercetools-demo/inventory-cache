"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryService = void 0;
const DynamoDBService_1 = require("../DynamoDB/DynamoDBService");
const DynamoDBInventoryService_1 = require("../DynamoDB/DynamoDBInventoryService");
const RedisInventoryService_1 = require("../Redis/RedisInventoryService");
const RedisService_1 = require("../Redis/RedisService");
const getInventoryService = () => {
    if (process.env.USE_DYNAMODB === "true") {
        console.log("Using DynamoDB inventory service");
        const ddb = new DynamoDBService_1.DynamoDBService({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            region: process.env.AWS_REGION || "us-east-2",
            sessionToken: process.env.AWS_SESSION_TOKEN || "",
        });
        return new DynamoDBInventoryService_1.InventoryService(ddb);
    }
    if (process.env.USE_REDIS === "true") {
        console.log("Using REDIS inventory service");
        const REDISHOST = process.env.REDISHOST || "localhost";
        const REDISPORT = process.env.REDISPORT || 6379;
        const redisService = new RedisService_1.RedisService({
            host: REDISHOST,
            port: Number(REDISPORT),
        });
        return new RedisInventoryService_1.InventoryService(redisService);
    }
};
exports.getInventoryService = getInventoryService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZW50b3J5SW5qZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW52ZW50b3J5SW5qZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUVBQThEO0FBQzlELG1GQUErRjtBQUMvRiwwRUFBMkY7QUFFM0Ysd0RBQXFEO0FBRTlDLE1BQU0sbUJBQW1CLEdBQUcsR0FBa0MsRUFBRTtJQUVyRSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxLQUFLLE1BQU0sRUFBRTtRQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFFaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQ0FBZSxDQUFDO1lBQzlCLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLEVBQUU7WUFDaEQsZUFBZSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLElBQUksRUFBRTtZQUN4RCxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksV0FBVztZQUM3QyxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFO1NBQ2xELENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSwyQ0FBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQztJQUVELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEtBQUssTUFBTSxFQUFFO1FBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM3QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxXQUFXLENBQUM7UUFDdkQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDO1FBRWhELE1BQU0sWUFBWSxHQUFHLElBQUksMkJBQVksQ0FBQztZQUNwQyxJQUFJLEVBQUUsU0FBUztZQUNmLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDO1NBQ3hCLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSx3Q0FBcUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUNoRDtBQUNILENBQUMsQ0FBQztBQTNCVyxRQUFBLG1CQUFtQix1QkEyQjlCIn0=
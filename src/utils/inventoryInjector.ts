import { DynamoDBService } from "../DynamoDB/DynamoDBService";
import { InventoryService as DDBInventoryService } from "../DynamoDB/DynamoDBInventoryService";
import { InventoryService as RedisInventoryService } from "../Redis/RedisInventoryService";
import { TInventoryService } from "../types/InventoryService";
import { RedisClient } from "../Redis/RedisClient";
import { RedisService } from "../Redis/RedisService";

export const getInventoryService = (): TInventoryService | undefined => {

  if (process.env.USE_DYNAMODB === "true") {
    console.log("Using DynamoDB inventory service");

    const ddb = new DynamoDBService({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      region: process.env.AWS_REGION || "us-east-2",
      sessionToken: process.env.AWS_SESSION_TOKEN || "",
    });

    return new DDBInventoryService(ddb);
  }

  if (process.env.USE_REDIS === "true") {
    console.log("Using REDIS inventory service");
    const REDISHOST = process.env.REDISHOST || "localhost";
    const REDISPORT = process.env.REDISPORT || 6379;

    const redisService = new RedisService({
      host: REDISHOST,
      port: Number(REDISPORT),
    });

    return new RedisInventoryService(redisService);
  }
};

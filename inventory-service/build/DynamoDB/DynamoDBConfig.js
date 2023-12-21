"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBConfig = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoDBConfig {
    constructor(config) {
        this.accessKeyId = config.accessKeyId;
        this.secretAccessKey = config.secretAccessKey;
        this.region = config.region;
        this.sessionToken = config.sessionToken;
    }
    getDynamoDbClient() {
        const dynamoDbClient = new client_dynamodb_1.DynamoDB({
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
                sessionToken: this.sessionToken,
            },
            region: this.region,
        });
        return dynamoDbClient;
    }
}
exports.DynamoDBConfig = DynamoDBConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1vREJDb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvRHluYW1vREIvRHluYW1vREJDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQW9EO0FBU3BELE1BQWEsY0FBYztJQU16QixZQUFZLE1BQWM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUM5QyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQzFDLENBQUM7SUFFTSxpQkFBaUI7UUFDdEIsTUFBTSxjQUFjLEdBQUcsSUFBSSwwQkFBUSxDQUFDO1lBQ2xDLFdBQVcsRUFBRTtnQkFDWCxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7Z0JBQzdCLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZTtnQkFDckMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQ2hDO1lBQ0QsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3BCLENBQUMsQ0FBQztRQUNILE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQXhCRCx3Q0F3QkMifQ==
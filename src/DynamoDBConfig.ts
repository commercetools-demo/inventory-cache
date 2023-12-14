import { DynamoDB } from "@aws-sdk/client-dynamodb";

export interface Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken: string;
}

export class DynamoDBConfig {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private sessionToken: string;

  constructor(config: Config) {
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.region = config.region;
    this.sessionToken = config.sessionToken;
  }

  public getDynamoDbClient(): DynamoDB {
    const dynamoDbClient = new DynamoDB({
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

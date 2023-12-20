import {
  AttributeValue,
  DynamoDB,
  ReturnValue,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";

import { DynamoDBRepository } from "./DynamoDBRepository";
import { Config, DynamoDBConfig } from "./DynamoDBConfig";

export class DynamoDBService implements DynamoDBRepository {
  private dynamoDbClient: DynamoDB;
  private readonly partitionKeyName: string = "sc";
  private readonly tableName: string = "inventory";
  private readonly availableQuantityAttributeName: string = "availableQuantity";
  private readonly reservedQuantityAttributeName: string = "reservedQuantity";
  private readonly initialQuantityAttributeName: string = "initialQuantity";

  constructor(config: Config) {
    const dynamoDbClient = new DynamoDBConfig(config);
    this.dynamoDbClient = dynamoDbClient.getDynamoDbClient();
  }

  private getPartitionKeyValue(sku: string, channel: string | undefined): string {
    return sku + ":" + channel || "";
  }

  private getPartitionKeyMap(
    sku: string,
    channel: string | undefined
  ): { [key: string]: AttributeValue } {
    let map: { [key: string]: AttributeValue } = {};
    map[this.partitionKeyName] = { S: this.getPartitionKeyValue(sku, channel) };
    return map;
  }

  public async reserveItem(
    sku: string,
    channel: string | undefined,
    quantity: number
  ): Promise<boolean> {
    let values: { [key: string]: AttributeValue } = {};
    let names: { [key: string]: string } = {};
    values[":quantity"] = { N: quantity.toString() };
    values[":zero"] = { N: "0" };

    names["#reserveQuantityAttributeName"] = this.reservedQuantityAttributeName;
    names["#availableQuantityAttributeName"] =
      this.availableQuantityAttributeName;

    let updateItemRequest: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: this.getPartitionKeyMap(sku, channel),
      UpdateExpression:
        "SET #reserveQuantityAttributeName = if_not_exists(#reserveQuantityAttributeName, :zero) + :quantity, #availableQuantityAttributeName = #availableQuantityAttributeName - :quantity",
      ConditionExpression:
        ":quantity <= #availableQuantityAttributeName AND #availableQuantityAttributeName >= :zero",
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "UPDATED_NEW",
    };

    try {
      await this.dynamoDbClient.updateItem(updateItemRequest);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public async releaseItem(
    sku: string,
    channel: string | undefined,
    quantity: number
  ): Promise<boolean> {
    let values: { [key: string]: AttributeValue } = {};
    let names: { [key: string]: string } = {};

    values[":quantity"] = { N: quantity.toString() };
    values[":zero"] = { N: "0" };
    names["#reserveQuantityAttributeName"] = this.reservedQuantityAttributeName;
    names["#availableQuantityAttributeName"] =
      this.availableQuantityAttributeName;

    let updateItemRequest: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: this.getPartitionKeyMap(sku, channel),
      UpdateExpression:
        "SET #reserveQuantityAttributeName = if_not_exists(#reserveQuantityAttributeName, :zero) - :quantity, #availableQuantityAttributeName = #availableQuantityAttributeName + :quantity",
      ConditionExpression: "#reserveQuantityAttributeName >= :zero",
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "NONE",
    };

    try {
      await this.dynamoDbClient.updateItem(updateItemRequest);
      return true;
    } catch (e) {
      console.error("Error updating item:");
      console.error(e);
      return false;
    }
  }

  public async restockItem(
    sku: string,
    channel: string | undefined,
    quantity: number
  ): Promise<void> {
    let values: { [key: string]: AttributeValue } = {};
    let names: { [key: string]: string } = {};

    values[":quantity"] = { N: quantity.toString() };
    names["#availableQuantityAttributeName"] =
      this.availableQuantityAttributeName;

    let updateItemRequest: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: this.getPartitionKeyMap(sku, channel),
      UpdateExpression:
        "SET #availableQuantityAttributeName = #availableQuantityAttributeName + :quantity",
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "NONE",
    };

    try {
      await this.dynamoDbClient.updateItem(updateItemRequest);
    } catch (e) {
      console.error("Error updating item:");
      console.error(e);
    }
  }

  public async unstockItem(
    sku: string,
    channel: string | undefined,
    quantity: number
  ): Promise<void> {
    let values: { [key: string]: AttributeValue } = {};
    let names: { [key: string]: string } = {};

    values[":quantity"] = { N: quantity.toString() };
    values[":zero"] = { N: "0" };
    names["#reserveQuantityAttributeName"] = this.reservedQuantityAttributeName;

    let updateItemRequest: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: this.getPartitionKeyMap(sku, channel),
      UpdateExpression:
        "SET #reserveQuantityAttributeName = if_not_exists(#reserveQuantityAttributeName, :zero) - :quantity",
      ConditionExpression: "#reserveQuantityAttributeName >= :zero",
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "NONE",
    };

    try {
      await this.dynamoDbClient.updateItem(updateItemRequest);
    } catch (e) {
      console.error("Error updating item:");
      console.error(e);
    }
  }
}

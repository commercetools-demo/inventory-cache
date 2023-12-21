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
exports.DynamoDBService = void 0;
const DynamoDBConfig_1 = require("./DynamoDBConfig");
class DynamoDBService {
    constructor(config) {
        this.partitionKeyName = "sc";
        this.tableName = "inventory";
        this.availableQuantityAttributeName = "availableQuantity";
        this.reservedQuantityAttributeName = "reservedQuantity";
        this.initialQuantityAttributeName = "initialQuantity";
        const dynamoDbClient = new DynamoDBConfig_1.DynamoDBConfig(config);
        this.dynamoDbClient = dynamoDbClient.getDynamoDbClient();
    }
    getPartitionKeyValue(sku, channel) {
        return sku + ":" + channel || "";
    }
    getPartitionKeyMap(sku, channel) {
        let map = {};
        map[this.partitionKeyName] = { S: this.getPartitionKeyValue(sku, channel) };
        return map;
    }
    reserveItem(sku, channel, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = {};
            let names = {};
            values[":quantity"] = { N: quantity.toString() };
            values[":zero"] = { N: "0" };
            names["#reserveQuantityAttributeName"] = this.reservedQuantityAttributeName;
            names["#availableQuantityAttributeName"] =
                this.availableQuantityAttributeName;
            let updateItemRequest = {
                TableName: this.tableName,
                Key: this.getPartitionKeyMap(sku, channel),
                UpdateExpression: "SET #reserveQuantityAttributeName = if_not_exists(#reserveQuantityAttributeName, :zero) + :quantity, #availableQuantityAttributeName = #availableQuantityAttributeName - :quantity",
                ConditionExpression: ":quantity <= #availableQuantityAttributeName AND #availableQuantityAttributeName >= :zero",
                ExpressionAttributeNames: names,
                ExpressionAttributeValues: values,
                ReturnValues: "UPDATED_NEW",
            };
            try {
                yield this.dynamoDbClient.updateItem(updateItemRequest);
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    releaseItem(sku, channel, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = {};
            let names = {};
            values[":quantity"] = { N: quantity.toString() };
            values[":zero"] = { N: "0" };
            names["#reserveQuantityAttributeName"] = this.reservedQuantityAttributeName;
            names["#availableQuantityAttributeName"] =
                this.availableQuantityAttributeName;
            let updateItemRequest = {
                TableName: this.tableName,
                Key: this.getPartitionKeyMap(sku, channel),
                UpdateExpression: "SET #reserveQuantityAttributeName = if_not_exists(#reserveQuantityAttributeName, :zero) - :quantity, #availableQuantityAttributeName = #availableQuantityAttributeName + :quantity",
                ConditionExpression: "#reserveQuantityAttributeName >= :zero",
                ExpressionAttributeNames: names,
                ExpressionAttributeValues: values,
                ReturnValues: "NONE",
            };
            try {
                yield this.dynamoDbClient.updateItem(updateItemRequest);
                return true;
            }
            catch (e) {
                console.error("Error updating item:");
                console.error(e);
                return false;
            }
        });
    }
    restockItem(sku, channel, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = {};
            let names = {};
            values[":quantity"] = { N: quantity.toString() };
            names["#availableQuantityAttributeName"] =
                this.availableQuantityAttributeName;
            let updateItemRequest = {
                TableName: this.tableName,
                Key: this.getPartitionKeyMap(sku, channel),
                UpdateExpression: "SET #availableQuantityAttributeName = #availableQuantityAttributeName + :quantity",
                ExpressionAttributeNames: names,
                ExpressionAttributeValues: values,
                ReturnValues: "NONE",
            };
            try {
                yield this.dynamoDbClient.updateItem(updateItemRequest);
            }
            catch (e) {
                console.error("Error updating item:");
                console.error(e);
            }
        });
    }
    unstockItem(sku, channel, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = {};
            let names = {};
            values[":quantity"] = { N: quantity.toString() };
            values[":zero"] = { N: "0" };
            names["#reserveQuantityAttributeName"] = this.reservedQuantityAttributeName;
            let updateItemRequest = {
                TableName: this.tableName,
                Key: this.getPartitionKeyMap(sku, channel),
                UpdateExpression: "SET #reserveQuantityAttributeName = if_not_exists(#reserveQuantityAttributeName, :zero) - :quantity",
                ConditionExpression: "#reserveQuantityAttributeName >= :zero",
                ExpressionAttributeNames: names,
                ExpressionAttributeValues: values,
                ReturnValues: "NONE",
            };
            try {
                yield this.dynamoDbClient.updateItem(updateItemRequest);
            }
            catch (e) {
                console.error("Error updating item:");
                console.error(e);
            }
        });
    }
}
exports.DynamoDBService = DynamoDBService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1vREJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0R5bmFtb0RCL0R5bmFtb0RCU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxxREFBMEQ7QUFFMUQsTUFBYSxlQUFlO0lBUTFCLFlBQVksTUFBYztRQU5ULHFCQUFnQixHQUFXLElBQUksQ0FBQztRQUNoQyxjQUFTLEdBQVcsV0FBVyxDQUFDO1FBQ2hDLG1DQUE4QixHQUFXLG1CQUFtQixDQUFDO1FBQzdELGtDQUE2QixHQUFXLGtCQUFrQixDQUFDO1FBQzNELGlDQUE0QixHQUFXLGlCQUFpQixDQUFDO1FBR3hFLE1BQU0sY0FBYyxHQUFHLElBQUksK0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxHQUFXLEVBQUUsT0FBMkI7UUFDbkUsT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVPLGtCQUFrQixDQUN4QixHQUFXLEVBQ1gsT0FBMkI7UUFFM0IsSUFBSSxHQUFHLEdBQXNDLEVBQUUsQ0FBQztRQUNoRCxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQzVFLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVZLFdBQVcsQ0FDdEIsR0FBVyxFQUNYLE9BQTJCLEVBQzNCLFFBQWdCOztZQUVoQixJQUFJLE1BQU0sR0FBc0MsRUFBRSxDQUFDO1lBQ25ELElBQUksS0FBSyxHQUE4QixFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxF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
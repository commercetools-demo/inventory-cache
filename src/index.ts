import express from "express";

import { config } from "dotenv";
import { DynamoDBService } from "./DynamoDB/DynamoDBService";
import { InventoryService as DDBInventoryService } from "./DynamoDB/DynamoDBInventoryService";
import { TInventoryService } from "./types/InventoryService";
import { createreservation } from "./routes";

config();
const app = express();
const port = 3000;

app.use(express.json());

let inventory: TInventoryService;

if (process.env.USE_DYNAMODB === "true") {
  console.log("Using DynamoDB inventory service");
  
  const ddb = new DynamoDBService({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "us-east-2",
    sessionToken: process.env.AWS_SESSION_TOKEN || "",
  });
  
  inventory = new DDBInventoryService(ddb);
}

app.post("/createreservation", (req, res) => {
  console.log(req.body);
  createreservation(inventory, req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

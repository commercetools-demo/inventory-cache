import express from "express";
import { createreservation } from "./CreateReservation";
import { DynamoDBService } from "./DynamoDBService";
import { InventoryService } from "./InventoryService";
import { config } from "dotenv";

config();
const app = express();
const port = 3000;

app.use(express.json());

const ddb = new DynamoDBService({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  region: process.env.AWS_REGION || "us-east-2",
  sessionToken: process.env.AWS_SESSION_TOKEN || "",
});

const inventory = new InventoryService(ddb);

app.post("/createreservation", (req, res) => {
  console.log(req.body);
  createreservation(inventory, req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

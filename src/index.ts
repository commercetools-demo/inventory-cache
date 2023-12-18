import express from "express";

import { config } from "dotenv";
config();

import { createreservation } from "./routes";
import { getInventoryService } from "./utils/inventoryInjector";

const app = express();
const port = 3000;

app.use(express.json());

const inventory = getInventoryService();
if (!inventory) {
  console.error("Inventory service not initialized");
  process.exit(1);
}

app.post("/createreservation", (req, res) => {
  createreservation(inventory, req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

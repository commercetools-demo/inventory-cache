import { config } from 'dotenv';
config();

import express from 'express';
import { cancelOrder, cancelReservation, createReservation, finalizeOrder } from './routes';
import { getInventoryService } from './utils/inventoryInjector';

const app = express();

const PORT = 8080;

app.use(express.json());

const inventory = getInventoryService();
if (!inventory) {
  console.error('Inventory service not initialized');
  process.exit(1);
}

app.post('/create-reservation', async (req, res) => {
  try {
    const response = await createReservation(inventory, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(503).json({ error: error.message });
  }
});

app.delete('/cancel-reservation', async (req, res) => {
  try {
    const response = await cancelReservation(inventory, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(503).json({ error: error.message });
  }
});

app.post('/finalize-order', async (req, res) => {
  try {
    const response = await finalizeOrder(inventory, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(503).json({ error: error.message });
  }
});

app.delete('/cancel-order', async (req, res) => {
  try {
    const response = await cancelOrder(inventory, req.body);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(503).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

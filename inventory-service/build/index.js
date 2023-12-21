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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const routes_1 = require("./routes");
const inventoryInjector_1 = require("./utils/inventoryInjector");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const inventory = (0, inventoryInjector_1.getInventoryService)();
if (!inventory) {
    console.error('Inventory service not initialized');
    process.exit(1);
}
app.post('/create-reservation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, routes_1.createReservation)(inventory, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(503).json({ error: error.message });
    }
}));
app.delete('/cancel-reservation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, routes_1.cancelReservation)(inventory, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(503).json({ error: error.message });
    }
}));
app.post('/finalize-order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, routes_1.finalizeOrder)(inventory, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(503).json({ error: error.message });
    }
}));
app.delete('/cancel-order', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, routes_1.cancelOrder)(inventory, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(503).json({ error: error.message });
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBOEI7QUFFOUIsbUNBQWdDO0FBQ2hDLElBQUEsZUFBTSxHQUFFLENBQUM7QUFFVCxxQ0FBNEY7QUFDNUYsaUVBQWdFO0FBRWhFLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQ3RCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztBQUVsQixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUV4QixNQUFNLFNBQVMsR0FBRyxJQUFBLHVDQUFtQixHQUFFLENBQUM7QUFDeEMsSUFBSSxDQUFDLFNBQVMsRUFBRTtJQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUNuRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2pCO0FBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUNqRCxJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDBCQUFpQixFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEM7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNoRDtBQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQ25ELElBQUk7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsMEJBQWlCLEVBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNoQztJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ2hEO0FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDN0MsSUFBSTtRQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxzQkFBYSxFQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDaEM7SUFBQyxPQUFPLEtBQVUsRUFBRTtRQUNuQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNoRDtBQUNILENBQUMsQ0FBQSxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUM3QyxJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLG9CQUFXLEVBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNoQztJQUFDLE9BQU8sS0FBVSxFQUFFO1FBQ25CLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ2hEO0FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELENBQUMsQ0FBQyxDQUFDIn0=
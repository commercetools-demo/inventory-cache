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
exports.InventoryService = void 0;
const create_client_1 = require("../CT/client/create.client");
class InventoryService {
    constructor(redisService) {
        this.redisService = redisService;
        this.apiRoot = (0, create_client_1.createApiRoot)();
    }
    reserveInventoryOnReservation(cartDraft) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateDraftLineItems(cartDraft.lineItems);
            return this.reserveLineItems(cartDraft.lineItems);
        });
    }
    releaseInventoryOnCancelReservation(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateLineItems(cart.lineItems);
            return this.releaseLineItems(cart.lineItems);
        });
    }
    restockInventoryOnCancelOrder(order) {
        this.validateLineItems(order.lineItems);
        return this.restockLineItems(order.lineItems);
    }
    releaseInventoryOnFinishOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateLineItems(order.lineItems);
            return this.unstockLineItems(order.lineItems);
        });
    }
    unstockLineItems(lineItems) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let allReleased = true;
            for (let lineItem of lineItems) {
                const result = yield this.redisService.unstockItem((_a = lineItem.variant) === null || _a === void 0 ? void 0 : _a.sku, (_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id, lineItem.quantity);
                if (!result) {
                    allReleased = false;
                }
            }
            return allReleased;
        });
    }
    restockLineItems(lineItems) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let allRestocked = true;
            for (let lineItem of lineItems) {
                const result = yield this.redisService.restockItem((_a = lineItem.variant) === null || _a === void 0 ? void 0 : _a.sku, (_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id, lineItem.quantity);
                if (!result) {
                    allRestocked = false;
                }
            }
            return allRestocked;
        });
    }
    releaseLineItems(lineItems) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let allReleased = false;
            for (let lineItem of lineItems) {
                allReleased = yield this.redisService.releaseItem((_a = lineItem.variant) === null || _a === void 0 ? void 0 : _a.sku, (_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id, lineItem.quantity);
                if (!allReleased) {
                    return false;
                }
            }
            return allReleased;
        });
    }
    reserveLineItems(lineItems) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let allItemsReserved = true;
            let reservedLineItems = [];
            try {
                for (let lineItem of lineItems) {
                    let reservationResult = yield this.redisService.reserveItem(lineItem.sku, (_a = lineItem.supplyChannel) === null || _a === void 0 ? void 0 : _a.id, lineItem.quantity);
                    if (reservationResult === 'SUCCESS') {
                        reservedLineItems.push(lineItem);
                    }
                    else if (reservationResult === 'DOES_NOT_EXIST') {
                        yield this.initializeInventory(lineItem);
                        let retryReservationResult = yield this.redisService.reserveItem(lineItem.sku, (_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id, lineItem.quantity);
                        if (retryReservationResult === 'SUCCESS') {
                            reservedLineItems.push(lineItem);
                        }
                        else {
                            throw new Error('Failed to initialize inventory');
                        }
                    }
                    else {
                        throw new Error('Failed to reserve inventory');
                    }
                }
            }
            catch (error) {
                allItemsReserved = false;
                console.error(error);
            }
            finally {
                if (!allItemsReserved) {
                    this.revertAllLineItemsReservations(reservedLineItems);
                }
            }
            return allItemsReserved;
        });
    }
    revertAllLineItemsReservations(lineItems) {
        var _a;
        for (let lineItem of lineItems) {
            this.redisService.releaseItem(lineItem.sku, (_a = lineItem.supplyChannel) === null || _a === void 0 ? void 0 : _a.id, lineItem.quantity);
        }
    }
    initializeInventory(lineItem) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const availableQuantityInCT = yield this.getAvailableQuantityForLineItem(lineItem);
            if (availableQuantityInCT === null) {
                throw new Error('Could not find available quantity in CT');
            }
            const initializationResult = yield this.redisService.initializeItem(lineItem.sku, (_a = lineItem.supplyChannel) === null || _a === void 0 ? void 0 : _a.id, availableQuantityInCT);
            if (initializationResult !== 'SUCCESS') {
                throw new Error('Failed to initialize inventory');
            }
        });
    }
    getAvailableQuantityForLineItem(lineItem) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let channelId = null;
            let availableQuantity = null;
            if ((_a = lineItem.supplyChannel) === null || _a === void 0 ? void 0 : _a.id) {
                const channelResult = yield this.apiRoot
                    .channels()
                    .get({
                    queryArgs: {
                        limit: 1,
                        where: `id = "${(_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id}" `,
                    },
                })
                    .execute();
                if (channelResult.body.results.length === 1) {
                    channelId = channelResult.body.results[0].id;
                }
            }
            let where = `sku = "${lineItem.sku}"`;
            if (channelId === null) {
                where += ` AND supplyChannel is not defined`;
            }
            else {
                where += ` AND (supplyChannel(id = "${channelId}") OR supplyChannel is not defined)`;
            }
            const inventoryResult = yield this.apiRoot
                .inventory()
                .get({
                queryArgs: {
                    limit: 2,
                    where: where,
                },
            })
                .execute();
            if (inventoryResult.body.results.length === 1 ||
                (inventoryResult.body.results.length === 2 &&
                    typeof ((_c = inventoryResult.body.results[0].supplyChannel) === null || _c === void 0 ? void 0 : _c.id) ===
                        'undefined')) {
                availableQuantity = inventoryResult.body.results[0].availableQuantity;
            }
            else if (inventoryResult.body.results.length === 2) {
                availableQuantity = inventoryResult.body.results[1].availableQuantity;
            }
            return availableQuantity;
        });
    }
    validateDraftLineItems(lineItems) {
        if (!lineItems) {
            throw new Error('No line items provided');
        }
        if (lineItems.length === 0) {
            throw new Error('No line items provided');
        }
        lineItems.forEach((lineItem) => {
            if (!lineItem.quantity || lineItem.quantity == 0) {
                throw new Error('No quantity provided');
            }
            if (!lineItem.sku) {
                throw new Error('No sku provided');
            }
        });
    }
    validateLineItems(lineItems) {
        if (!lineItems) {
            throw new Error('No line items provided');
        }
        if (lineItems.length === 0) {
            throw new Error('No line items provided');
        }
        lineItems.forEach((lineItem) => {
            if (!lineItem.quantity || lineItem.quantity == 0) {
                throw new Error('No quantity provided');
            }
            if (!lineItem.variant) {
                throw new Error('No variant provided');
            }
            if (!lineItem.variant.sku) {
                throw new Error('No sku provided');
            }
        });
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVkaXNJbnZlbnRvcnlTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL1JlZGlzL1JlZGlzSW52ZW50b3J5U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFTQSw4REFBMkQ7QUFHM0QsTUFBYSxnQkFBZ0I7SUFFM0IsWUFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFBLDZCQUFhLEdBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRVksNkJBQTZCLENBQ3hDLFNBQW9COztZQUVwQixJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxTQUFVLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7SUFFWSxtQ0FBbUMsQ0FDOUMsSUFBVTs7WUFFVixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQyxDQUFDO0tBQUE7SUFFTSw2QkFBNkIsQ0FBQyxLQUFZO1FBQy9DLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFWSw2QkFBNkIsQ0FBQyxLQUFZOztZQUNyRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDO0tBQUE7SUFFYSxnQkFBZ0IsQ0FBQyxT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
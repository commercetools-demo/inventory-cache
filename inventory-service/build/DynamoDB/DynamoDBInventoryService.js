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
class InventoryService {
    constructor(ddbs) {
        this.ddbs = ddbs;
    }
    reserveInventoryOnReservation(cartDraft) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reserveLineItems(cartDraft.lineItems);
        });
    }
    releaseInventoryOnCancelReservation(cart) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.releaseLineItems(cart.lineItems);
        });
    }
    restockInventoryOnCancelOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            this.restockLineItems(order.lineItems);
            return true;
        });
    }
    releaseInventoryOnFinishOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            this.unstockLineItems(order.lineItems);
            return true;
        });
    }
    unstockLineItems(lineItems) {
        var _a, _b;
        for (let lineItem of lineItems) {
            this.ddbs.unstockItem((_a = lineItem.variant) === null || _a === void 0 ? void 0 : _a.sku, (_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id, lineItem.quantity);
        }
    }
    restockLineItems(lineItems) {
        var _a, _b;
        for (let lineItem of lineItems) {
            this.ddbs.restockItem((_a = lineItem.variant) === null || _a === void 0 ? void 0 : _a.sku, (_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id, lineItem.quantity);
        }
    }
    releaseLineItems(lineItems) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let allReleased = false;
            for (let lineItem of lineItems) {
                allReleased = yield this.ddbs.releaseItem((_a = lineItem.variant) === null || _a === void 0 ? void 0 : _a.sku, (_b = lineItem.supplyChannel) === null || _b === void 0 ? void 0 : _b.id, lineItem.quantity);
                if (!allReleased) {
                    return false;
                }
            }
            return allReleased;
        });
    }
    reserveLineItems(lineItems) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let allItemsReserved = true;
            let reservedLineItems = [];
            for (let lineItem of lineItems) {
                let reservationResult = yield this.ddbs.reserveItem(lineItem.sku, (_a = lineItem.supplyChannel) === null || _a === void 0 ? void 0 : _a.id, lineItem.quantity);
                if (reservationResult) {
                    reservedLineItems.push(lineItem);
                }
                else {
                    allItemsReserved = false;
                    break;
                }
            }
            if (!allItemsReserved) {
                this.revertAllLineItemsReservations(reservedLineItems);
            }
            return allItemsReserved;
        });
    }
    revertAllLineItemsReservations(lineItems) {
        var _a;
        for (let lineItem of lineItems) {
            this.ddbs.releaseItem(lineItem.sku, (_a = lineItem.supplyChannel) === null || _a === void 0 ? void 0 : _a.id, lineItem.quantity);
        }
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHluYW1vREJJbnZlbnRvcnlTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0R5bmFtb0RCL0R5bmFtb0RCSW52ZW50b3J5U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFJQSxNQUFhLGdCQUFnQjtJQUMzQixZQUFvQixJQUFxQjtRQUFyQixTQUFJLEdBQUosSUFBSSxDQUFpQjtJQUFHLENBQUM7SUFFaEMsNkJBQTZCLENBQUMsU0FBb0I7O1lBQzdELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxTQUFVLENBQUMsQ0FBQztRQUNyRCxDQUFDO0tBQUE7SUFFWSxtQ0FBbUMsQ0FBQyxJQUFVOztZQUN6RCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsQ0FBQztLQUFBO0lBRVksNkJBQTZCLENBQUMsS0FBWTs7WUFDckQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVZLDZCQUE2QixDQUFDLEtBQVk7O1lBQ3JELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFTyxnQkFBZ0IsQ0FBQyxTQUFxQjs7UUFDNUMsS0FBSyxJQUFJLFFBQVEsSUFBSSxTQUFTLEVBQUU7WUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQ25CLE1BQUEsUUFBUSxDQUFDLE9BQU8sMENBQUUsR0FBSSxFQUN0QixNQUFBLFFBQVEsQ0FBQyxhQUFhLDBDQUFFLEVBQUUsRUFDMUIsUUFBUSxDQUFDLFFBQVEsQ0FDbEIsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVPLGdCQUFnQixDQUFDLFNBQXFCOztRQUM1QyxLQUFLLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FDbkIsTUFBQSxRQUFRLENBQUMsT0FBTywwQ0FBRSxHQUFJLEVBQ3RCLE1BQUEsUUFBUSxDQUFDLGFBQWEsMENBQUUsRUFBRSxFQUMxQixRQUFRLENBQUMsUUFBUSxDQUNsQixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRWEsZ0JBQWdCLENBQUMsU0FBcUI7OztZQUNsRCxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDeEIsS0FBSyxJQUFJLFFBQVEsSUFBSSxTQUFTLEVBQUU7Z0JBQzlCLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUN2QyxNQUFBLFFBQVEsQ0FBQyxPQUFPLDBDQUFFLEdBQUksRUFDdEIsTUFBQSxRQUFRLENBQUMsYUFBYSwwQ0FBRSxFQUFFLEVBQzFCLFFBQVEsQ0FBQyxRQUFRLENBQ2xCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFdBQVcsRUFBRTtvQkFDaEIsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7YUFDRjtZQUNELE9BQU8sV0FBVyxDQUFDOztLQUNwQjtJQUVhLGdCQUFnQixDQUFDLFNBQTBCOzs7WUFDdkQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxpQkFBaUIsR0FBb0IsRUFBRSxDQUFDO1lBQzVDLEtBQUssSUFBSSxRQUFRLElBQUksU0FBUyxFQUFFO2dCQUM5QixJQUFJLGlCQUFpQixHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQ2pELFFBQVEsQ0FBQyxHQUFJLEVBQ2IsTUFBQSxRQUFRLENBQUMsYUFBYSwwQ0FBRSxFQUFFLEVBQzFCLFFBQVEsQ0FBQyxRQUFTLENBQ25CLENBQUM7Z0JBQ0YsSUFBSSxpQkFBaUIsRUFBRTtvQkFDckIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNsQztxQkFBTTtvQkFDTCxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7b0JBQ3pCLE1BQU07aUJBQ1A7YUFDRjtZQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDckIsSUFBSSxDQUFDLDhCQUE4QixDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDeEQ7WUFDRCxPQUFPLGdCQUFnQixDQUFDOztLQUN6QjtJQUVPLDhCQUE4QixDQUFDLFNBQTBCOztRQUMvRCxLQUFLLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FDbkIsUUFBUSxDQUFDLEdBQUksRUFDYixNQUFBLFFBQVEsQ0FBQyxhQUFhLDBDQUFFLEVBQUUsRUFDMUIsUUFBUSxDQUFDLFFBQVMsQ0FDbkIsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUNGO0FBdkZELDRDQXVGQyJ9
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
exports.cancelOrder = exports.cancelReservation = exports.finalizeOrder = exports.createReservation = void 0;
const createReservation = (inventory, body) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield inventory.reserveInventoryOnReservation(body);
    if (!response) {
        throw new Error('Failed to reserve inventory');
    }
    return {
        lineItems: body.lineItems,
    };
});
exports.createReservation = createReservation;
const finalizeOrder = (inventory, body) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield inventory.releaseInventoryOnFinishOrder(body);
    if (!response) {
        throw new Error('Failed to release inventory');
    }
    return {
        lineItems: body.lineItems,
    };
});
exports.finalizeOrder = finalizeOrder;
const cancelReservation = (inventory, body) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield inventory.releaseInventoryOnCancelReservation(body);
    if (!result) {
        throw new Error('Failed to release inventory');
    }
    return {
        lineItems: body.lineItems,
    };
});
exports.cancelReservation = cancelReservation;
const cancelOrder = (inventory, body) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield inventory.restockInventoryOnCancelOrder(body);
    if (!result) {
        throw new Error('Failed to release inventory');
    }
    return {
        lineItems: body.lineItems,
    };
});
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFTTyxNQUFNLGlCQUFpQixHQUFHLENBQy9CLFNBQTRCLEVBQzVCLElBQTJCLEVBQ1MsRUFBRTtJQUN0QyxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyw2QkFBNkIsQ0FDNUQsSUFBSSxDQUNMLENBQUM7SUFDRixJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2hEO0lBQ0QsT0FBTztRQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBVTtLQUMzQixDQUFDO0FBQ0osQ0FBQyxDQUFBLENBQUM7QUFiVyxRQUFBLGlCQUFpQixxQkFhNUI7QUFDSyxNQUFNLGFBQWEsR0FBRyxDQUMzQixTQUE0QixFQUM1QixJQUF1QixFQUNTLEVBQUU7SUFDbEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxTQUFTLENBQUMsNkJBQTZCLENBQzVELElBQUksQ0FDTCxDQUFDO0lBQ0YsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNoRDtJQUNELE9BQU87UUFDTCxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7S0FDMUIsQ0FBQztBQUNKLENBQUMsQ0FBQSxDQUFDO0FBYlcsUUFBQSxhQUFhLGlCQWF4QjtBQUVLLE1BQU0saUJBQWlCLEdBQUcsQ0FDL0IsU0FBNEIsRUFDNUIsSUFBMkIsRUFDUyxFQUFFO0lBQ3RDLE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLG1DQUFtQyxDQUNoRSxJQUFJLENBQ0wsQ0FBQztJQUNGLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDaEQ7SUFDRCxPQUFPO1FBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO0tBQzFCLENBQUM7QUFDSixDQUFDLENBQUEsQ0FBQztBQWJXLFFBQUEsaUJBQWlCLHFCQWE1QjtBQUVLLE1BQU0sV0FBVyxHQUFHLENBQ3pCLFNBQTRCLEVBQzVCLElBQXFCLEVBQ1MsRUFBRTtJQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyw2QkFBNkIsQ0FDMUQsSUFBSSxDQUNMLENBQUM7SUFDRixJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2hEO0lBQ0QsT0FBTztRQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztLQUMxQixDQUFDO0FBQ0osQ0FBQyxDQUFBLENBQUM7QUFiVyxRQUFBLFdBQVcsZUFhdEIifQ==
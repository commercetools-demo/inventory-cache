import { Cart, CartDraft, Order } from "@commercetools/platform-sdk";

export interface TInventoryService {
    reserveInventoryOnReservation: (cartDraft: CartDraft) => Promise<boolean>;
    releaseInventoryOnCancelReservation: (cart: Cart) => Promise<boolean>;
    restockInventoryOnCancelOrder: (order: Order) => Promise<boolean>;
    releaseInventoryOnFinishOrder: (order: Order) => Promise<boolean>;
}
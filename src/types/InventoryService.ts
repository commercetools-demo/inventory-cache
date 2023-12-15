import { LineItem, Order } from "@commercetools/platform-sdk";
import { ReservationLineItem } from "./CreateReservation";

export interface TInventoryService {

    reserveInventoryOnReservation: (lineItems: ReservationLineItem[]) => Promise<boolean>;
    releaseInventoryOnCancelReservation: (lineItems: LineItem[]) => Promise<boolean>;
    restockInventoryOnCancelOrder: (order: Order) => boolean;
    releaseInventoryOnFinishOrder: (order: Order) => boolean;
}
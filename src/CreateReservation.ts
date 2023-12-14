import { DynamoDBService } from "./DynamoDBService";
import { InventoryService } from "./InventoryService";

export interface ReservationLineItem {
  eventReferenceIdForInventory: string;
  eventReferenceIdForPricing: string;
  aimsProductReferenceId: string;
  aimsVariantReferenceId: string;
  quantity: number;
}
export interface CreateReservationBody {
  userIdentifier: string;
  currency: string;
  lineItems: ReservationLineItem[];
}
export const createreservation = async (
  inventory: InventoryService,
  body: CreateReservationBody
) => {
  inventory.reserveInventoryOnReservation(body.lineItems);
};

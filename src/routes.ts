import { CreateReservationBody } from "./types/CreateReservation";
import { TInventoryService } from "./types/InventoryService";

export const createreservation = async (
    inventory: TInventoryService,
    body: CreateReservationBody
  ) => {
    inventory.reserveInventoryOnReservation(body.lineItems);
  };
  
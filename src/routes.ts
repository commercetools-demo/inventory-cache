import {
  CancelReservationBody,
  CancelReservationResponse,
  CreateReservationResponse,
  CreateReservationBody,
} from './types/Cart';
import { TInventoryService } from './types/InventoryService';
import { CancelOrderResponse, CanceleOrderBody as CancelOrderBody, FinalizeOrderBody, FinalizeOrderResponse } from './types/Order';

export const createReservation = async (
  inventory: TInventoryService,
  body: CreateReservationBody
): Promise<CreateReservationResponse> => {
  const response = await inventory.reserveInventoryOnReservation(
    body
  );
  if (!response) {
    throw new Error('Failed to reserve inventory');
  }
  return {
    lineItems: body.lineItems!,
  };
};
export const finalizeOrder = async (
  inventory: TInventoryService,
  body: FinalizeOrderBody
): Promise<FinalizeOrderResponse> => {
  const response = await inventory.releaseInventoryOnFinishOrder(
    body
  );
  if (!response) {
    throw new Error('Failed to release inventory');
  }
  return {
    lineItems: body.lineItems,
  };
};

export const cancelReservation = async (
  inventory: TInventoryService,
  body: CancelReservationBody
): Promise<CancelReservationResponse> => {
  const result = await inventory.releaseInventoryOnCancelReservation(
    body
  );
  if (!result) {
    throw new Error('Failed to release inventory');
  }
  return {
    lineItems: body.lineItems,
  };
};

export const cancelOrder = async (
  inventory: TInventoryService,
  body: CancelOrderBody
): Promise<CancelOrderResponse> => {
  const result = await inventory.restockInventoryOnCancelOrder(
    body
  );
  if (!result) {
    throw new Error('Failed to release inventory');
  }
  return {
    lineItems: body.lineItems,
  };
};

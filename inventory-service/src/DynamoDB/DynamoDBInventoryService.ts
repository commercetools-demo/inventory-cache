import { DynamoDBService } from "./DynamoDBService";
import { Order, LineItem, CartDraft, LineItemDraft, Cart } from "@commercetools/platform-sdk";
import { TInventoryService } from "../types/InventoryService";

export class InventoryService implements TInventoryService {
  constructor(private ddbs: DynamoDBService) {}

  public async reserveInventoryOnReservation(cartDraft: CartDraft): Promise<boolean> {
    return this.reserveLineItems(cartDraft.lineItems!);
  }

  public async releaseInventoryOnCancelReservation(cart: Cart): Promise<boolean> {
    return this.releaseLineItems(cart.lineItems);
  }

  public async restockInventoryOnCancelOrder(order: Order): Promise<boolean> {
    this.restockLineItems(order.lineItems);
    return true;
  }

  public async releaseInventoryOnFinishOrder(order: Order): Promise<boolean> {
    this.unstockLineItems(order.lineItems);
    return true;
  }

  private unstockLineItems(lineItems: LineItem[]): void {
    for (let lineItem of lineItems) {
      this.ddbs.unstockItem(
        lineItem.variant?.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity
      );
    }
  }

  private restockLineItems(lineItems: LineItem[]): void {
    for (let lineItem of lineItems) {
      this.ddbs.restockItem(
        lineItem.variant?.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity
      );
    }
  }

  private async releaseLineItems(lineItems: LineItem[]): Promise<boolean> {
    let allReleased = false;
    for (let lineItem of lineItems) {
      allReleased = await this.ddbs.releaseItem(
        lineItem.variant?.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity
      );
      if (!allReleased) {
        return false;
      }
    }
    return allReleased;
  }

  private async reserveLineItems(lineItems: LineItemDraft[]): Promise<boolean> {
    let allItemsReserved = true;
    let reservedLineItems: LineItemDraft[] = [];
    for (let lineItem of lineItems) {
      let reservationResult = await this.ddbs.reserveItem(
        lineItem.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity!
      );
      if (reservationResult) {
        reservedLineItems.push(lineItem);
      } else {
        allItemsReserved = false;
        break;
      }
    }
    if (!allItemsReserved) {
      this.revertAllLineItemsReservations(reservedLineItems);
    }
    return allItemsReserved;
  }

  private revertAllLineItemsReservations(lineItems: LineItemDraft[]): void {
    for (let lineItem of lineItems) {
      this.ddbs.releaseItem(
        lineItem.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity!
      );
    }
  }
}

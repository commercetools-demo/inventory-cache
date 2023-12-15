import { ReservationLineItem } from "../types/CreateReservation";
import { DynamoDBService } from "./DynamoDBService";
import { Order, LineItem } from "@commercetools/platform-sdk";
import { TInventoryService } from "../types/InventoryService";

export class InventoryService implements TInventoryService {
  constructor(private ddbs: DynamoDBService) {}

  public async reserveInventoryOnReservation(lineItems: ReservationLineItem[]): Promise<boolean> {
    return this.reserveLineItems(lineItems);
  }

  public async releaseInventoryOnCancelReservation(lineItems: LineItem[]): Promise<boolean> {
    return this.releaseLineItems(lineItems);
  }

  public restockInventoryOnCancelOrder(order: Order): boolean {
    this.restockLineItems(order.lineItems);
    return true;
  }

  public releaseInventoryOnFinishOrder(order: Order): boolean {
    this.unstockLineItems(order.lineItems);
    return true;
  }

  private unstockLineItems(lineItems: LineItem[]): void {
    for (let lineItem of lineItems) {
      this.ddbs.unstockItem(
        lineItem.variant?.sku || "",
        lineItem.supplyChannel?.obj?.key || "",
        lineItem.quantity
      );
    }
  }

  private restockLineItems(lineItems: LineItem[]): void {
    for (let lineItem of lineItems) {
      this.ddbs.restockItem(
        lineItem.variant?.sku || "",
        lineItem.supplyChannel?.obj?.key || "",
        lineItem.quantity
      );
    }
  }

  private async releaseLineItems(lineItems: LineItem[]): Promise<boolean> {
    let allReleased = false;
    for (let lineItem of lineItems) {
      allReleased = await this.ddbs.releaseItem(
        lineItem.variant?.sku || "",
        lineItem.supplyChannel?.obj?.key || "",
        lineItem.quantity
      );
      if (!allReleased) {
        return false;
      }
    }
    return allReleased;
  }

  private async reserveLineItems(lineItems: ReservationLineItem[]): Promise<boolean> {
    let allItemsReserved = true;
    let reservedLineItems: ReservationLineItem[] = [];
    for (let lineItem of lineItems) {
      let reservationResult = await this.ddbs.reserveItem(
        lineItem.variantSKU,
        lineItem.inventoryChannelKey,
        lineItem.quantity
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

  private revertAllLineItemsReservations(lineItems: ReservationLineItem[]): void {
    for (let lineItem of lineItems) {
      this.ddbs.releaseItem(
        lineItem.variantSKU,
        lineItem.inventoryChannelKey,
        lineItem.quantity
      );
    }
  }
}

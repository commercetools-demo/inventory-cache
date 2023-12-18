import { ReservationLineItem } from '../types/CreateReservation';
import { Order, LineItem } from '@commercetools/platform-sdk';
import { TInventoryService } from '../types/InventoryService';
import { RedisService } from './RedisService';
import { createApiRoot } from '../CT/client/create.client';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';

export class InventoryService implements TInventoryService {
  private apiRoot: ByProjectKeyRequestBuilder;
  constructor(private redisService: RedisService) {
    this.apiRoot = createApiRoot();
  }

  public async reserveInventoryOnReservation(
    lineItems: ReservationLineItem[]
  ): Promise<boolean> {
    return this.reserveLineItems(lineItems);
  }

  public async releaseInventoryOnCancelReservation(
    lineItems: LineItem[]
  ): Promise<boolean> {
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
      this.redisService.unstockItem(
        lineItem.variant?.sku || '',
        lineItem.supplyChannel?.obj?.key || '',
        lineItem.quantity
      );
    }
  }

  private restockLineItems(lineItems: LineItem[]): void {
    for (let lineItem of lineItems) {
      this.redisService.restockItem(
        lineItem.variant?.sku || '',
        lineItem.supplyChannel?.obj?.key || '',
        lineItem.quantity
      );
    }
  }

  private async releaseLineItems(lineItems: LineItem[]): Promise<boolean> {
    let allReleased = false;
    for (let lineItem of lineItems) {
      allReleased = await this.redisService.releaseItem(
        lineItem.variant?.sku || '',
        lineItem.supplyChannel?.obj?.key || '',
        lineItem.quantity
      );
      if (!allReleased) {
        return false;
      }
    }
    return allReleased;
  }

  private async reserveLineItems(
    lineItems: ReservationLineItem[]
  ): Promise<boolean> {
    let allItemsReserved = true;
    let reservedLineItems: ReservationLineItem[] = [];
    try {
      for (let lineItem of lineItems) {
        let reservationResult = await this.redisService.reserveItem(
          lineItem.variantSKU,
          lineItem.inventoryChannelKey,
          lineItem.quantity
        );

        if (reservationResult === 'SUCCESS') {
          reservedLineItems.push(lineItem);
        } else if (reservationResult === 'DOES_NOT_EXIST') {
          await this.initializeInventory(lineItem);
          let retryReservationResult = await this.redisService.reserveItem(
            lineItem.variantSKU,
            lineItem.inventoryChannelKey,
            lineItem.quantity
          );
          if (retryReservationResult === 'SUCCESS') {
            reservedLineItems.push(lineItem);
          } else {
            throw new Error('Failed to initialize inventory');
          }
        } else {
          throw new Error('Failed to reserve inventory');
        }
      }
    } catch (error) {
      allItemsReserved = false;
      console.error(error);
    } finally {
      if (!allItemsReserved) {
        this.revertAllLineItemsReservations(reservedLineItems);
      }
    }
    return allItemsReserved;
  }

  private revertAllLineItemsReservations(
    lineItems: ReservationLineItem[]
  ): void {
    for (let lineItem of lineItems) {
      this.redisService.releaseItem(
        lineItem.variantSKU,
        lineItem.inventoryChannelKey,
        lineItem.quantity
      );
    }
  }

  private async initializeInventory(
    lineItem: ReservationLineItem
  ): Promise<void> {
    const availableQuantityInCT =
      await this.getAvailableQuantityForLineItem(lineItem);
    if (availableQuantityInCT === null) {
      throw new Error('Could not find available quantity in CT');
    }
    const initializationResult = await this.redisService.initializeItem(
      lineItem.variantSKU,
      lineItem.inventoryChannelKey,
      availableQuantityInCT
    );
    if (initializationResult !== 'SUCCESS') {
      throw new Error('Failed to initialize inventory');
    }
  }

  private async getAvailableQuantityForLineItem(
    lineItem: ReservationLineItem
  ): Promise<number | null> {
    let channelId: string | null = null;
    let availableQuantity: number | null = null;

    const channelResult = await this.apiRoot
      .channels()
      .get({
        queryArgs: {
          limit: 1,
          where: `key = "${lineItem.inventoryChannelKey}" `,
        },
      })
      .execute();

    if (channelResult.body.results.length === 1) {
      channelId = channelResult.body.results[0].id;
    }

    let where = `sku = "${lineItem.variantSKU}"`;
    if (channelId === null) {
      where += ` AND supplyChannel is not defined`;
    } else {
      where += ` AND (supplyChannel(id = "${channelId}") OR supplyChannel is not defined)`;
    }

    const inventoryResult = await this.apiRoot
      .inventory()
      .get({
        queryArgs: {
          limit: 2,
          where: where,
        },
      })
      .execute();

    if (
      inventoryResult.body.results.length === 1 ||
      (inventoryResult.body.results.length === 2 &&
        typeof inventoryResult.body.results[0].supplyChannel?.id ===
          'undefined')
    ) {
      availableQuantity = inventoryResult.body.results[0].availableQuantity;
    } else if (inventoryResult.body.results.length === 2) {
      availableQuantity = inventoryResult.body.results[1].availableQuantity;
    }
    return availableQuantity;
  }
}

import {
  Order,
  LineItem,
  CartDraft,
  LineItemDraft,
  Cart,
} from '@commercetools/platform-sdk';
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
    cartDraft: CartDraft
  ): Promise<boolean> {
    this.validateDraftLineItems(cartDraft.lineItems);
    return this.reserveLineItems(cartDraft.lineItems!);
  }

  public async releaseInventoryOnCancelReservation(
    cart: Cart
  ): Promise<boolean> {
    this.validateLineItems(cart.lineItems);
    return this.releaseLineItems(cart.lineItems);
  }

  public restockInventoryOnCancelOrder(order: Order): Promise<boolean> {
    this.validateLineItems(order.lineItems);
    return this.restockLineItems(order.lineItems);
  }

  public async releaseInventoryOnFinishOrder(order: Order): Promise<boolean> {
    this.validateLineItems(order.lineItems);
    return this.unstockLineItems(order.lineItems);
  }

  private async unstockLineItems(lineItems: LineItem[]): Promise<boolean> {
    let allReleased = true;
    for (let lineItem of lineItems) {
      const result = await this.redisService.unstockItem(
        lineItem.variant?.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity
      );
      if (!result) {
        allReleased = false;
      }
    }
    return allReleased;
  }

  private async restockLineItems(lineItems: LineItem[]): Promise<boolean> {
    let allRestocked = true;
    for (let lineItem of lineItems) {
      const result = await this.redisService.restockItem(
        lineItem.variant?.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity
      );
      if (!result) {
        allRestocked = false;
      }
    }
    return allRestocked;
  }

  private async releaseLineItems(lineItems: LineItem[]): Promise<boolean> {
    let allReleased = false;
    for (let lineItem of lineItems) {
      allReleased = await this.redisService.releaseItem(
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
    try {
      for (let lineItem of lineItems) {
        let reservationResult = await this.redisService.reserveItem(
          lineItem.sku!,
          lineItem.supplyChannel?.id,
          lineItem.quantity!
        );

        if (reservationResult === 'SUCCESS') {
          reservedLineItems.push(lineItem);
        } else if (reservationResult === 'DOES_NOT_EXIST') {
          await this.initializeInventory(lineItem);
          let retryReservationResult = await this.redisService.reserveItem(
            lineItem.sku!,
            lineItem.supplyChannel?.id,
            lineItem.quantity!
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

  private revertAllLineItemsReservations(lineItems: LineItemDraft[]): void {
    for (let lineItem of lineItems) {
      this.redisService.releaseItem(
        lineItem.sku!,
        lineItem.supplyChannel?.id,
        lineItem.quantity!
      );
    }
  }

  private async initializeInventory(lineItem: LineItemDraft): Promise<void> {
    const availableQuantityInCT =
      await this.getAvailableQuantityForLineItem(lineItem);
    if (availableQuantityInCT === null) {
      throw new Error('Could not find available quantity in CT');
    }
    const initializationResult = await this.redisService.initializeItem(
      lineItem.sku!,
      lineItem.supplyChannel?.id,
      availableQuantityInCT
    );
    if (initializationResult !== 'SUCCESS') {
      throw new Error('Failed to initialize inventory');
    }
  }

  private async getAvailableQuantityForLineItem(
    lineItem: LineItemDraft
  ): Promise<number | null> {
    let channelId: string | null = null;
    let availableQuantity: number | null = null;

    if (lineItem.supplyChannel?.id) {
      const channelResult = await this.apiRoot
        .channels()
        .get({
          queryArgs: {
            limit: 1,
            where: `id = "${lineItem.supplyChannel?.id}" `,
          },
        })
        .execute();

      if (channelResult.body.results.length === 1) {
        channelId = channelResult.body.results[0].id;
      }
    }

    let where = `sku = "${lineItem.sku}"`;
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

  private validateDraftLineItems(lineItems?: LineItemDraft[]): void {
    if (!lineItems) {
      throw new Error('No line items provided');
    }
    if (lineItems.length === 0) {
      throw new Error('No line items provided');
    }
    lineItems.forEach((lineItem) => {
      if (!lineItem.quantity || lineItem.quantity == 0) {
        throw new Error('No quantity provided');
      }
      if (!lineItem.sku) {
        throw new Error('No sku provided');
      }
    });
  }

  private validateLineItems(lineItems?: LineItem[]): void {
    if (!lineItems) {
      throw new Error('No line items provided');
    }
    if (lineItems.length === 0) {
      throw new Error('No line items provided');
    }
    lineItems.forEach((lineItem) => {
      if (!lineItem.quantity || lineItem.quantity == 0) {
        throw new Error('No quantity provided');
      }
      if (!lineItem.variant) {
        throw new Error('No variant provided');
      }
      if (!lineItem.variant.sku) {
        throw new Error('No sku provided');
      }
    });
  }
}

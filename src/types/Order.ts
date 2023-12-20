import {  LineItem, Order } from '@commercetools/platform-sdk';

export interface FinalizeOrderBody extends Order {}
export interface FinalizeOrderResponse {
    lineItems: LineItem[];
}

export interface CanceleOrderBody extends Order {}
export interface CancelOrderResponse {
    lineItems: LineItem[];
}

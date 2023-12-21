import {
  Cart,
  CartDraft,
  LineItem,
  LineItemDraft,
} from '@commercetools/platform-sdk';

export interface CancelReservationBody extends Cart {}

export interface CancelReservationResponse {
  lineItems: LineItem[];
}

export interface CreateReservationBody extends CartDraft {}

export interface CreateReservationResponse {
  lineItems: LineItemDraft[];
}

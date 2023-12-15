export interface ReservationLineItem {
  inventoryChannelKey: string;
  priceChannelKey: string;
  productKey: string;
  variantSKU: string;
  quantity: number;
}
export interface CreateReservationBody {
  userIdentifier: string;
  currency: string;
  lineItems: ReservationLineItem[];
}

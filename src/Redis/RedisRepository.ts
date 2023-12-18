export interface RedisRepository {
    reserveItem(sku: string, channel: string, strQuantity: string | number): Promise<ReservationState>;
    initializeItem(sku: string, channel: string, strQuantity: string | number): Promise<InitializationState>;
    releaseItem(sku: string, channel: string, strQuantity: string | number): Promise<boolean>;
    unstockItem(sku: string, channel: string, strQuantity: string | number): void;
    restockItem(sku: string, channel: string, strQuantity: string | number): void;
}

export type ReservationState = 'FAILED' | 'SUCCESS' | 'DOES_NOT_EXIST';
export type InitializationState = 'FAILED' | 'SUCCESS' | 'ALREADY_EXISTS';
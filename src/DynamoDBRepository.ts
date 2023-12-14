export interface DynamoDBRepository {
    reserveItem(sku: string, channel: string, quantity: number): Promise<boolean>;
    releaseItem(sku: string, channel: string, quantity: number): Promise<boolean>;
    unstockItem(sku: string, channel: string, quantity: number): void;
    restockItem(sku: string, channel: string, quantity: number): void;
}
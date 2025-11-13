export declare class OrderItemDto {
    ticketTypeId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    organizerId: string;
    items: OrderItemDto[];
    currency: string;
    paymentMethodId?: string;
}

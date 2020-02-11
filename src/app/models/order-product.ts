export interface IOrderProduct {
    id: number,
    price: number,
    quantity: number,
    createdAt: string,
    updatedAt: string,
    productId: number,
    orderId: number
}

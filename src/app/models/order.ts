import { IOrderProduct } from './order-product';

export interface IOrder {
    id: number,
    createdAt: string,
    updatedAt: string,
    userId: number,
    shippingOptionId: number,
    order_products: IOrderProduct[]
}

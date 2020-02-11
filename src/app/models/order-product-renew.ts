import { IProduct } from './product';

export interface IOrderProductRenew {
    id: number,
    price: number,
    quantity: number,
    createdAt: string,
    updatedAt: string,
    productId: number,
    orderId: number,
    product: IProduct
}
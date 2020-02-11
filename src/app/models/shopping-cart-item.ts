import { IProduct } from './product';

export interface IShoppingCartItem {
        cartProductId: number,
        userId: number,
        product: IProduct,
        quantity: number
}

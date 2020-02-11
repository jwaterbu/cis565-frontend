import { IReview } from './review';

export interface IProduct {
    id: number;
    categoryId: number;
    title: string;
    description: string;
    price: number;
    small_image_path: string;
    large_image_path: string;
    createdAt: string;
    updatedAt: string;
    reviews: IReview[];
}

export interface IReview {
    id: number;
    userId: number;
    productId: number;
    title: string;
    body: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

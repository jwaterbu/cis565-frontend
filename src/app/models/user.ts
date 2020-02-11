import { IReview } from './review';

export interface IUser {
    id: number,
    username: string,
    email: string,
    admin: boolean,
    createdAt: string,
    updatedAt: string,
    reviews: IReview[];
}

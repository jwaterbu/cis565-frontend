import { Injectable } from '@angular/core';
import { IReview } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getRatingAvg(reviews: IReview[]) {
    let avg = reviews.reduce((total, next) => total + next.rating, 0) / reviews.length;
    return isNaN(avg) ? 0 : avg;
  }
}

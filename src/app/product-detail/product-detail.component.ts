import { Component, OnInit } from '@angular/core';
import { IProduct } from '../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ReviewService } from '../services/review.service';
import { IReview } from '../models/review';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CartService } from '../services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthGuard } from '../auth.guard';
import { AuthenticationService } from '../services/authentication.service';
import { IUser } from '../models/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = "Product Details";
  currentUser: IUser;
  product: IProduct;
  errorMessage: string;
  reviewForm: FormGroup;
  reviews: IReview[];

  reviewToEdit: IReview;
  editState: boolean = false;
  ratings: number[] = [
    1, 2, 3, 4, 5
  ];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    private fb: FormBuilder,
    private cartService: CartService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authGuard: AuthGuard,
    private authenticationService: AuthenticationService,
    private location: Location) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    let id = +this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(id).subscribe({
      next: product => {
        this.product = product;
        this.reviews = product.reviews;
      },
      error: err => this.errorMessage = err
    });

    this.reviewForm = this.fb.group({
      rating: 5,
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    })

  }

  addReview(): void {
    if (this.authGuard.canActivate(this.route.snapshot, this.router.routerState.snapshot)) {
      this.reviewService.addReview(this.product.id,
        this.reviewForm.get('title').value,
        this.reviewForm.get('content').value,
        this.reviewForm.get('rating').value).subscribe(review => {
          this.reviewService.getProductReviews(this.product.id).subscribe(
            (reviews) => {
              this.reviews = (reviews as IReview[]).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
              this.clearForm();
              this._snackBar.open('New review added!', '', {
                duration: 2000
              });
            }
          )
        })
    }
  }

  clearForm(): void {
    this.reviewForm.reset();
    this.reviewForm.get('rating').setValue(5);
  }

  editReview($event, review): void {
    this.editState = true;
    this.reviewToEdit = review;
  }

  updateReview(review: IReview): void {
    this.reviewService.updateReview(this.product.id, review.id, review.title, review.body, review.rating)
      .subscribe((review) =>
        this.reviewService.getProductReviews(this.product.id).subscribe(
          (reviews) => {
            this.reviews = (reviews as IReview[]).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            console.log(this.reviews);
            this.clearState();
            this._snackBar.open('Review updated!', '', {
              duration: 2000
            });
          }
        )
      )
  }

  deleteReview(review: IReview) {
    this.reviewService.deleteReview(this.product.id, review.id).subscribe((review) =>
      this.reviewService.getProductReviews(this.product.id).subscribe(
        (reviews) => {
          this.reviews = (reviews as IReview[]).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          this.clearState();
          this._snackBar.open('Review deleted!', '', {
            duration: 2000
          });
        }
      ));
  }

  clearState(): void {
    this.editState = false;
    this.reviewToEdit = null;
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: data
    });
  }

  addToCart(product: IProduct): void {
    if (this.authGuard.canActivate(this.route.snapshot, this.router.routerState.snapshot)) {
      this.cartService.updateCart(product).subscribe(() => {
        this.cartService.loadCartProducts().subscribe(() => {
          this.openDialog({
            title: 'Cart',
            message: `${product.title} has been added to your Cart. Would you like to continue shopping or checkout now?`
          })
        })
      })
    }
  }

  onBack(): void {
    //this.router.navigate(['/products']);
    this.location.back();
  }

}

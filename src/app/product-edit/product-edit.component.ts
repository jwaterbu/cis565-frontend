import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IProduct } from '../models/product';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

function numberValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = /^-?[\d.]+(?:e-?\d+)?$/.test(control.value)
  return valid ? null : { invalidNumber: { valid: false, value: control.value } }
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Add Product';
  private sub: Subscription
  product: IProduct;
  productForm: FormGroup;
  imageIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  errorMessage: string;

  constructor(private _snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, numberValidator]],
      categoryId: [1, Validators.required],
      imageId: [1, Validators.required]
    });

    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getProduct(id);
      }
    )
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get f() { return this.productForm.controls; }

  onSubmit() {
    const p = { ...this.product, ...this.productForm.value };
    p.small_image_path = this.getImage(p.imageId);
    p.large_image_path = p.small_image_path;

    if (p.id) {
      this.productService.updateProduct(p).subscribe({
        next: () => {
          this._snackBar.open(`Product has been updated!`, '', {
            duration: 4000
          });
          this.onSaveComplete()
        },
        error: err => console.log(err)
      })
    } else {
      this.productService.createProduct(p).subscribe({
        next: () => {
          this._snackBar.open(`Product added to catalog!`, '', {
            duration: 4000
          });
          this.onSaveComplete()
        },
        error: err => console.log(err)
      })
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.productForm.reset();
    this.router.navigate(['/admin']);
  }

  getImage(id): string {
    return `https://cis-565.appspot.com/images/item_${id}.jpg`;
  }

  getImageId(url): number {
    return url.match(/\d+/g).map(Number)[1];
  }

  getProduct(id: number): void {
    this.productService.getProduct(id)
      .subscribe({
        next: (product: IProduct) => {
          if (product) {
            this.displayProduct(product)
          } else {
            this.router.navigate(['/product/0/edit']);
          }
        },
        error: err => {
          this.errorMessage = err
          console.log(this.errorMessage);
        }
      });
  }

  displayProduct(product: IProduct): void {
    if (this.productForm) {
      this.productForm.reset();
    }
    this.product = product;

    this.pageTitle = `Edit Product: ${this.product.title}`;
    // Update the data on the form
    this.productForm.patchValue({
      title: this.product.title,
      description: this.product.description,
      price: this.product.price,
      categoryId: this.product.categoryId,
      imageId: this.getImageId(this.product.small_image_path)
    });
  }
}

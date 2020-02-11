import { Component, OnInit } from '@angular/core';
import { IProduct } from '../models/product';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthGuard } from '../auth.guard';
import { ActivatedRoute, Router } from '@angular/router';
import { IReview } from '../models/review';

export interface PriceRange {
  text: string;
  min: number;
  max: number;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  pageTitle: string = "All Products";
  loading: boolean = true;
  errorMessage: string;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  priceRanges: PriceRange[] = [
    {
      text: 'Under $25',
      min: 0,
      max: 25
    }, {
      text: '$25 to $50',
      min: 25,
      max: 50
    }, {
      text: '$50 to $100',
      min: 50,
      max: 100
    }, {
      text: '$100 to $200',
      min: 100,
      max: 200
    }, {
      text: '$200 & Above',
      min: 200,
      max: 1000000
    }, {
      text: 'Any Price',
      min: 0,
      max: 1000000
    }]

  constructor(private productService: ProductService,
    private cartService: CartService,
    private _snackBar: MatSnackBar,
    private authGuard: AuthGuard,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    //this.products = this.filteredProducts = this.productService.getProducts();
    this.loading = true;
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.filteredProducts = this.products;
        this.loading = false;
      },
      error => this.errorMessage = <any>error   // this is casting
    );
    this.priceFilter = 'Any Price';
    this.genderFilter = 'All';
  }

  _listFilter: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performTextFilter(this.listFilter) : this.products;
    this.filteredProducts = this.priceFilter ? this.performPriceFilter(this.priceFilter, this.filteredProducts) : this.filteredProducts;
    this.filteredProducts = this.genderFilter !== 'All' ? this.performGenderFilter(this.genderFilter, this.filteredProducts) : this.filteredProducts;
  }

  _priceFilter: string;
  get priceFilter(): string {
    return this._priceFilter;
  }
  set priceFilter(value: string) {
    this._priceFilter = value;
    this.filteredProducts = this.listFilter ? this.performTextFilter(this.listFilter) : this.products;
    this.filteredProducts = this.priceFilter ? this.performPriceFilter(this.priceFilter, this.filteredProducts) : this.filteredProducts;
    this.filteredProducts = this.genderFilter !== 'All' ? this.performGenderFilter(this.genderFilter, this.filteredProducts) : this.filteredProducts;
  }

  _genderFilter: string;
  get genderFilter(): string {
    return this._genderFilter;
  }
  set genderFilter(value: string) {
    this._genderFilter = value;
    this.filteredProducts = this.listFilter ? this.performTextFilter(this.listFilter) : this.products;
    this.filteredProducts = this.priceFilter ? this.performPriceFilter(this.priceFilter, this.filteredProducts) : this.filteredProducts;
    this.filteredProducts = this.genderFilter !== 'All' ? this.performGenderFilter(this.genderFilter, this.filteredProducts) : this.filteredProducts;
  }

  performTextFilter(filterByText: string): IProduct[] {
    filterByText = filterByText.toLowerCase();

    return this.products.filter((product: IProduct) =>
      product.title.toLowerCase().indexOf(filterByText) !== -1);
  }

  performPriceFilter(filterByPrice: string, filteredList?: IProduct[]): IProduct[] {
    let priceRange: PriceRange = this.priceRanges.find((p) => p.text === filterByPrice);
    filteredList = filteredList ? filteredList : this.products;

    return filteredList.filter((product: IProduct) =>
      product.price >= priceRange.min && product.price < priceRange.max);
  }

  performGenderFilter(filterByGender: string, filteredList?: IProduct[]): IProduct[] {
    filteredList = filteredList ? filteredList : this.products;
    let gender: number = filterByGender === 'Male' ? 1 : 2;
    return filteredList.filter((product: IProduct) =>
      product.categoryId === gender);
  }

  clearFilter(): void {
    this.filteredProducts = this.products;
    this.priceFilter = 'Any Price';
    this.genderFilter = 'All';
  }

  addToCart(product: IProduct): void {
    if (this.authGuard.canActivate(this.route.snapshot, this.router.routerState.snapshot)) {
      this.cartService.updateCart(product).subscribe(() => {
        this.cartService.loadCartProducts().subscribe(() => {
          this._snackBar.open(`${product.title} has been added to your Cart.`, '', {
            duration: 2000
          });
        });
      })
    }
  }

  getRatingAvg(reviews:IReview[]){
    let avg =  reviews.reduce((total, next) => total + next.rating, 0) / reviews.length;
    return isNaN(avg) ? 0 : avg;
  }
}

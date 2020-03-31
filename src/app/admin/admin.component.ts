import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { IUser } from '../models/user';
import { UserService } from '../services/user.service';
import { IProduct } from '../models/product';
import { ProductService } from '../services/product.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UtilService } from '../shared/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminComponent implements OnInit {
  pageTitle: string = "Administrator Management"
  users: IUser[];
  products: IProduct[];
  dialogResult: boolean;

  displayedUserColumns: string[] = ['id', 'username', 'email', 'createdAt', 'updatedAt', 'edit', 'deleteBtn'];
  userDataSource;

  productDataSource;
  displayedProductColumns: string[] = ['id', 'title', 'price', 'categoryId', 'rating'];
  expandedProduct: IProduct | null;

  constructor(private userService: UserService, private productService: ProductService, public utilService: UtilService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.reloadUsers();
    this.reloadProducts();
  }

  reloadUsers() {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        this.userDataSource = new MatTableDataSource(this.users);
      }
    )
  }

  reloadProducts() {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.productDataSource = products;
      }
    )
  }

  applyUserFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyProductFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(user: IUser): void {
    this.openDialog({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.username}?`,
      btnOkText: 'Yes',
      btnCancelText: 'No'
    }, user.id, 'USER');
  }

  deleteProduct(product: IProduct): void {
    this.openDialog({
      title: 'Delete Product',
      message: `Are you sure you want to delete ${product.title}?`,
      btnOkText: 'Yes',
      btnCancelText: 'No'
    }, product.id, 'PRODUCT');
  }

  openDialog(data, id, requestType: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.dialogResult = dialogResult;
      if (this.dialogResult) {
        if (requestType == 'USER') {
          this.userService.deleteUser(id).subscribe((user) => {
            this.reloadUsers();
            this._snackBar.open(`User has been deleted!`, '', {
              duration: 4000
            });
          });
        }
        if (requestType == 'PRODUCT') {
          this.productService.deleteProduct(id).subscribe((product => {
            this.reloadProducts();
            this._snackBar.open(`Product has been deleted!`, '', {
              duration: 4000
            });
          }));
        }
      }
    });
  }

}

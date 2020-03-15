import { NgModule } from '@angular/core';
import { MatBadgeModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatDialogModule, MatDividerModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule, MatTableModule, MatTabsModule, MatToolbarModule } from '@angular/material';

const MaterialComponents = [
  MatCardModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatBadgeModule,
  MatIconModule,
  MatInputModule,
  MatButtonToggleModule,
  MatRadioModule,
  MatDividerModule,
  MatDialogModule,
  MatSelectModule,
  MatListModule,
  MatSnackBarModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatSlideToggleModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }

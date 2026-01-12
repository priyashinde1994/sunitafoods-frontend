import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../services/Product.model';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../admin-dashboard/confirm-dialog.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  products$!: Observable<Product[]>;
  error: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(
    private adminService: AdminProductService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    console.log('AdminProductsComponent loaded');
    this.adminService.list().subscribe({
      next: (res) => console.log('Products loaded:', res),
      error: (err) => {
        console.error('Failed to load products', err);
        this.snackBar.open('❌ Failed to load products', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
    this.products$ = this.adminService.products$;
  }
  goToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  getImageUrl(path: string): string {
    return this.apiUrl.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
  }

  addProduct(): void {
    this.router.navigate(['/admin/add-product']);
    this.snackBar.open('➡️ Redirected to Add Product form', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  editProduct(id: number): void {
    this.router.navigate([`/admin/edit-product/${id}`]);
  }

  // -------------------------
  // Confirm dialog helper
  // -------------------------
  openConfirmDialog(message: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message },
    });
    return dialogRef.afterClosed();
  }

  deleteProduct(id: number): void {
    this.openConfirmDialog('Are you sure you want to delete this product?').subscribe((result) => {
      if (result) {
        this.adminService.delete(id).subscribe({
          next: () => {
            this.snackBar.open('✅ Product deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
          error: (err) => {
            console.error('Delete failed', err);
            this.snackBar.open('❌ Failed to delete product', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  activateProduct(id: number): void {
    this.adminService.activate(id).subscribe({
      next: () => {
        this.snackBar.open('✅ Product activated', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Activation failed', err);
        this.snackBar.open('❌ Failed to activate product', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  deactivateProduct(id: number): void {
    this.adminService.deactivate(id).subscribe({
      next: () => {
        this.snackBar.open('⚠️ Product deactivated', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Deactivation failed', err);
        this.snackBar.open('❌ Failed to deactivate product', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }
}

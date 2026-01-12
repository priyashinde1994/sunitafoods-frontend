import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order } from '../../services/models/order.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {  MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    MatSnackBarModule, // ✅ Required for snackbars
    MatDialogModule    // ✅ Required for dialogs
  ],
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  error: string | null = null;
  orders: Order[] = [];


  constructor(
    private adminService: AdminProductService,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }
  

  addProduct(): void {
    this.router.navigate(['/admin/add-product']);
    this.snackBar.open('➡️ Redirected to Add Product form', 'Close', { duration: 3000 });
  }

  // -------------------------
  // Load orders
  // -------------------------
  loadOrders(): void {
    this.adminService.getOrders().subscribe({
      next: (res: Order[]) => {
        this.orders = res;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Could not load orders';
      },
    });
  }

  // -------------------------
  // Change order status
  // -------------------------
  changeStatus(orderId: number, newStatus: string): void {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`✅ Order ${orderId} updated to ${newStatus}`, 'Close', { duration: 3000 });
        this.loadOrders();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        this.snackBar.open('❌ Failed to update order status', 'Close', { duration: 3000 });
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}


import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order } from '../../services/models/order.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
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
    MatDialogModule, // ✅ Required for dialogs
  ],
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  error: string | null = null;
  orders: Order[] = [];

  pageSize = 10; // how many rows per page
  currentPage = 1; // start at page 1

  // calculate total pages
  get totalPages(): number {
    return Math.ceil(this.filteredOrders().length / this.pageSize);
  }

  // slice orders for current page
  pagedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders().slice(start, end);
  }

  // change page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

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
        this.snackBar.open(`✅ Order ${orderId} updated to ${newStatus}`, 'Close', {
          duration: 3000,
        });
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

  filters = {
    id: '',
    fullName: '',
    email: '',
    phone: '',
    totalAmount: '',
    status: '',
    address: '',
    createdFrom: '', // ✅ start date\
     createdTo: '' // ✅ end date
  };
filteredOrders(): Order[] {
  return this.orders.filter(order => {
    const createdAt = new Date(order.createdAt);

    const fromOk = !this.filters.createdFrom || createdAt >= new Date(this.filters.createdFrom);
    const toOk   = !this.filters.createdTo   || createdAt <= new Date(this.filters.createdTo);

    return (
      (!this.filters.id || order.id.toString().includes(this.filters.id)) &&
      (!this.filters.fullName || order.fullName?.toLowerCase().includes(this.filters.fullName.toLowerCase())) &&
      (!this.filters.email || order.email?.toLowerCase().includes(this.filters.email.toLowerCase())) &&
      (!this.filters.phone || order.phone?.toLowerCase().includes(this.filters.phone.toLowerCase())) &&
      (!this.filters.totalAmount || order.totalAmount.toString().includes(this.filters.totalAmount)) &&
      (!this.filters.status || order.status === this.filters.status) &&
      (!this.filters.address || order.address?.toLowerCase().includes(this.filters.address.toLowerCase())) &&
      fromOk && toOk
    );
  });
}

}

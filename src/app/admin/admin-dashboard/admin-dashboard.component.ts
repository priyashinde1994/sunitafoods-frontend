import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ import CommonModule
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../../services/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  imports: [FormsModule, RouterModule, CommonModule],
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  products: any[] = [];
  error: string | null = null;
  
  
orders: Order[] = []; 


  constructor(private adminService: AdminProductService, private router: Router,  private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  // -------------------------
  // Load all products
  // -------------------------
  loadProducts(): void {
    this.adminService.list().subscribe({
      next: (res: any[]) => {
        this.products = res;
      },
      error: (err: any) => {
        console.error('Failed to load products', err);
        this.error = 'Could not load products';
      },
    });
  }

  // -------------------------
  // Add product (navigate to add form)
  // -------------------------
  addProduct(): void {
    this.router.navigate(['/admin/add-product']);
  }

  // -------------------------
  // Edit product (navigate to edit form)
  // -------------------------
  editProduct(id: number): void {
    this.router.navigate([`/admin/edit-product/${id}`]);
  }

  // -------------------------
  // Delete product
  // -------------------------
  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.delete(id).subscribe({
        next: () => {
          alert('Product deleted');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete product');
        },
      });
    }
  }

  // -------------------------
  // Activate product
  // -------------------------
  activateProduct(id: number): void {
    this.adminService.activate(id).subscribe({
      next: () => {
        alert('Product activated');
        this.loadProducts();
      },
      error: (err) => {
        console.error('Activation failed', err);
        alert('Failed to activate product');
      },
    });
  }

  // -------------------------
  // Deactivate product
  // -------------------------
  deactivateProduct(id: number): void {
    this.adminService.deactivate(id).subscribe({
      next: () => {
        alert('Product deactivated');
        this.loadProducts();
      },
      error: (err) => {
        console.error('Deactivation failed', err);
        alert('Failed to deactivate product');
      },
    });
  }

  loadOrders(): void {
  this.adminService.getOrders().subscribe({
    next: (res: Order[]) => {
      this.orders = res;   // ✅ backend already returns an array
      console.log('Orders loaded:', this.orders);
      this.cd.detectChanges(); // ✅ force Angular to refresh view
    },
    error: (err) => {
      console.error('Failed to load orders', err);
      this.error = 'Could not load orders';
    },
  });
}


  changeStatus(orderId: number, newStatus: string): void {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        alert(`Order ${orderId} updated to ${newStatus}`);
        this.loadOrders();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Failed to update order status');
      },
    });
  }
}

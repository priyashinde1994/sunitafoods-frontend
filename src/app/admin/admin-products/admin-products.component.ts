import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../services/Product.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products$!: Observable<Product[]>;
  error: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(
    private adminService: AdminProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AdminProductsComponent loaded');
    this.adminService.list();                     // ✅ triggers initial load
    this.products$ = this.adminService.products$; // ✅ subscribe to BehaviorSubject
  }

  getImageUrl(path: string): string {
    return this.apiUrl.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
  }

  addProduct(): void {
    this.router.navigate(['/admin/add-product']);
  }

  editProduct(id: number): void {
    this.router.navigate([`/admin/edit-product/${id}`]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.delete(id).subscribe({
        next: () => alert('Product deleted'),
        error: (err) => {
          console.error('Delete failed', err);
          alert('Failed to delete product');
        }
      });
    }
  }

  activateProduct(id: number): void {
    this.adminService.activate(id).subscribe({
      next: () => alert('Product activated'),
      error: (err) => {
        console.error('Activation failed', err);
        alert('Failed to activate product');
      }
    });
  }

  deactivateProduct(id: number): void {
    this.adminService.deactivate(id).subscribe({
      next: () => alert('Product deactivated'),
      error: (err) => {
        console.error('Deactivation failed', err);
        alert('Failed to deactivate product');
      }
    });
  }
}

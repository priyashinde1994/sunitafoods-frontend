import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products$!: Observable<any[]>;   // ✅ observable for async pipe
  search = '';
  apiUrl = environment.apiUrl;

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(): void {
    const term = this.search?.trim();
    this.products$ = this.productService.list(term); // ✅ assign observable directly
  }

  onSearch(): void {
    this.loadProducts();
  }

  addToCart(productId: number) {
    this.cartService.add(productId, 1).subscribe({
      next: () => {
        console.log('Product added to cart');
        this.router.navigateByUrl('/cart-checkout');
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

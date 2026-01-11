import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public products: any[] = [];
  search = '';
  apiUrl = environment.apiUrl;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public auth: AuthService,
    private router: Router
  ) {
     this.loadProducts(); // ❌ works, but not best practice 
  }

  ngOnInit() {
    
  }
  loadProducts(): void {
  const cached = localStorage.getItem('products');
  if (cached) {
    this.products = JSON.parse(cached);
  }
  this.productService.list().subscribe({
    next: (res) => {
      this.products = Array.isArray(res) ? res : [];
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  });
}


  // loadProducts(): void {
  //   const term = this.search?.trim();
  //   this.productService.list(term).subscribe({
  //     next: (res) => {
  //       console.log('Products from API:', res);
  //       this.products = Array.isArray(res) ? res : [];
  //     },
  //     error: (err) => {
  //       console.error('Error loading products', err);
  //       this.products = []; // ✅ fallback to empty array
  //     }
  //   });
  // }

  onSearch(): void {
    this.loadProducts(); // ✅ trigger search manually
  }

  addToCart(productId: number) {
    this.cartService.add(productId, 1).subscribe({
      next: () => {
        console.log('Product added to cart');
        this.router.navigateByUrl('/cart-checkout'); // ✅ corrected path
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

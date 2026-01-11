import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'; // 👈 import environment

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule]
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  quantity: number = 1;

  // 👇 expose apiUrl for template usage
  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', productId);

    this.http.get<any>(`${environment.apiUrl}api/products/${productId}`).subscribe({
      next: (data) => {
        console.log('Product loaded:', data);
        this.product = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load product', err)
    });
  }

  goToCart() {
    this.router.navigate(['/cart-checkout']);
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(productId: number) {
    this.cartService.add(productId, this.quantity).subscribe({
      next: () => alert('Product added to cart!'),
      error: (err) => console.error('Failed to add to cart', err)
    });
  }
}

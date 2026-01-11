import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // 👈 import environment

@Component({
  selector: 'app-cart-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css'],
})
export class CartCheckoutComponent implements OnInit {
  defaultAddress$!: Observable<any>;
  paymentMethod: string = 'COD';

  // 👇 expose apiUrl for template usage
  apiUrl = environment.apiUrl;

  constructor(
    public cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {
    this.cartService.loadCart();
  }

  ngOnInit(): void {
    this.defaultAddress$ = this.http.get<any>(
      `${environment.apiUrl}api/addresses/default`
    );
  }

  increment(item: any) {
    const newQty = item.quantity + 1;
    this.cartService.updateQuantity(item.id, newQty).subscribe();
  }

  decrement(item: any) {
    const newQty = item.quantity - 1;
    if (newQty > 0) {
      this.cartService.updateQuantity(item.id, newQty).subscribe();
    } else {
      this.removeItem(item.id);
    }
  }

  removeItem(id: number) {
    this.cartService.removeItem(id).subscribe();
  }

  clearCart() {
    this.cartService.clear().subscribe();
  }

  getItemLabel(count: number): string {
    return count === 1 ? 'item' : 'items';
  }

  placeOrder(defaultAddress: any): void {
    if (!defaultAddress) {
      alert('No default address set. Please add one in your profile.');
      return;
    }

    const payload = {
      fullName: defaultAddress.fullName,
      email: defaultAddress.email,
      address:
        defaultAddress.addressLine1 +
        (defaultAddress.addressLine2 ? ' ' + defaultAddress.addressLine2 : ''),
      city: defaultAddress.city,
      zip: defaultAddress.zipcode,
      paymentMethod: this.paymentMethod,
      items: this.cartService.getCartSnapshot(),
    };

    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Session expired. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }

    this.http.post(`${environment.apiUrl}api/orders/create`, payload).subscribe({
      next: (res: any) => this.router.navigate(['/order-confirmation', res.orderId]),
      error: (err) => {
        console.error('Order failed:', err);
        alert('Failed to place order. Please try again.');
      },
    });
  }
}

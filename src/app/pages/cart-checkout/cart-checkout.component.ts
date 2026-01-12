import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatSnackBarModule],
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css'],
})
export class CartCheckoutComponent implements OnInit {
  defaultAddress$!: Observable<any>;
  paymentMethod: string = 'COD';
  apiUrl = environment.apiUrl;

  constructor(
    public cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
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
    this.cartService.updateQuantity(item.id, newQty).subscribe({
      next: () =>
        this.snackBar.open('✅ Quantity increased', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }),
    });
  }

  decrement(item: any) {
    const newQty = item.quantity - 1;
    if (newQty > 0) {
      this.cartService.updateQuantity(item.id, newQty).subscribe({
        next: () =>
          this.snackBar.open('✅ Quantity decreased', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }),
      });
    } else {
      this.removeItem(item.id);
    }
  }

  removeItem(id: number) {
    this.cartService.removeItem(id).subscribe({
      next: () =>
        this.snackBar.open('🗑️ Item removed from cart', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }),
      error: () =>
        this.snackBar.open('❌ Failed to remove item', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }),
    });
  }

  clearCart() {
    this.cartService.clear().subscribe({
      next: () =>
        this.snackBar.open('🧹 Cart cleared', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }),
      error: () =>
        this.snackBar.open('❌ Failed to clear cart', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }),
    });
  }

  getItemLabel(count: number): string {
    return count === 1 ? 'item' : 'items';
  }

  placeOrder(defaultAddress: any): void {
    if (!defaultAddress) {
      this.snackBar.open(
        '⚠️ No default address set. Please add one in your profile.',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        }
      );
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
      this.snackBar.open('⚠️ Session expired. Please log in again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      this.router.navigate(['/login']);
      return;
    }

    this.http.post(`${environment.apiUrl}api/orders/create`, payload).subscribe({
      next: (res: any) => {
        this.snackBar.open('✅ Order placed successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.router.navigate(['/order-confirmation', res.orderId]);
      },
      error: (err) => {
        console.error('Order failed:', err);
        this.snackBar.open('❌ Failed to place order. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }
}

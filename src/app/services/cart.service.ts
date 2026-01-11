import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = `${environment.apiUrl}api/cart`;

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private itemCountSubject = new BehaviorSubject<number>(0);

  cartItems$ = this.cartItemsSubject.asObservable();
  total$ = this.totalSubject.asObservable();
  itemCount$ = this.itemCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }
  loadCart(): void {
  this.http.get<any[]>(this.baseUrl).subscribe(items => {
    this.cartItemsSubject.next(items);
    this.updateTotals(items);
    localStorage.setItem('cart', JSON.stringify(items)); // optional, if you want offline fallback
  });
}


  // loadCart(): void {
  //   const saved = localStorage.getItem('cart');
  //   if (saved) {
  //     const items = JSON.parse(saved);
  //     this.cartItemsSubject.next(items);
  //     this.updateTotals(items);
  //   } else {
  //     this.http.get<any[]>(this.baseUrl).subscribe(items => {
  //       this.cartItemsSubject.next(items);
  //       this.updateTotals(items);
  //       localStorage.setItem('cart', JSON.stringify(items));
  //     });
  //   }
  // }

  private saveCart(items: any[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
    this.updateTotals(items);
  }

  add(productId: number, quantity: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/add`, { productId, quantity })
      .pipe(tap(items => this.saveCart(items)));
  }

  removeItem(id: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.baseUrl}/item/${id}`)
      .pipe(tap(items => this.saveCart(items)));
  }

  clear(): Observable<any[]> {
    return this.http.delete<any[]>(`${this.baseUrl}/clear`)
      .pipe(tap(items => this.saveCart(items)));
  }

  updateQuantity(id: number, quantity: number): Observable<any[]> {
    return this.http.put<any[]>(`${this.baseUrl}/update/${id}`, { quantity })
      .pipe(tap(items => this.saveCart(items)));
  }

  private updateTotals(items: any[]): void {
    const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    this.totalSubject.next(total);
    this.itemCountSubject.next(itemCount);
  }

  // Helper to get snapshot for checkout payload
  getCartSnapshot(): any[] {
    return this.cartItemsSubject.getValue();
  }
}

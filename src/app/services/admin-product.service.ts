import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from './Product.model';
import { Order } from './models/order.model';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private OrderBaseUrl = `${environment.apiUrl}api/orders`;

  private baseUrl = `${environment.apiUrl}api/products/admin`;

  // ✅ BehaviorSubject to hold products state
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // -------------------------
  // Load all products (returns Observable for dashboard)
  // -------------------------
  list(search?: string): Observable<Product[]> {
    const url = search
      ? `${this.baseUrl}/list?search=${encodeURIComponent(search)}`
      : `${this.baseUrl}/list`;

    return this.http.get<Product[]>(url).pipe(
      tap((products) => this.productsSubject.next(products))
    );
  }

  // -------------------------
  // Add product
  // -------------------------
  add(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, product).pipe(
      tap(() => this.list().subscribe()) // reload after add
    );
  }

  // -------------------------
  // Update product
  // -------------------------
  update(id: number, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, product).pipe(
      tap(() => this.list().subscribe()) // reload after update
    );
  }

  // -------------------------
  // Delete product (✅ updates local list immediately)
  // -------------------------
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        const updated = this.productsSubject.value.filter(p => p.id !== id);
        this.productsSubject.next(updated); // ✅ update immediately
      })
    );
  }

  // -------------------------
  // Activate product
  // -------------------------
  activate(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/activate/${id}`, {}, { responseType: 'text' }).pipe(
      tap(() => {
        const updated = this.productsSubject.value.map(p =>
          p.id === id ? { ...p, active: true } : p
        );
        this.productsSubject.next(updated); // ✅ update immediately
      })
    );
  }

  // -------------------------
  // Deactivate product (✅ updates local list immediately)
  // -------------------------
  deactivate(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/deactivate/${id}`, {}, { responseType: 'text' }).pipe(
      tap(() => {
        const updated = this.productsSubject.value.map(p =>
          p.id === id ? { ...p, active: false } : p
        );
        this.productsSubject.next(updated); // ✅ update immediately
      })
    );
  }

  // -------------------------
  // Get product by ID
  // -------------------------
  getById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}api/products/${id}`);
  }


  updateOrderStatus(id: number, status: string): Observable<any>
   { return this.http.put(`${this.OrderBaseUrl}/admin/status/${id}`, { status }); }
   
   
   getOrders(): Observable<Order[]>
   { return this.http.get<Order[]>(`${this.OrderBaseUrl}/admin/list`); }
}

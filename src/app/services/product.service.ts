import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private baseUrl = `${environment.apiUrl}api/products`;

  constructor(private http: HttpClient) {}

  list(search?: string): Observable<any[]> {
    if (search && search.trim() !== '') {
      return this.http.get<any[]>(`${this.baseUrl}?search=${search}`);
    } else {
      return this.http.get<any[]>(this.baseUrl);
    }
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}


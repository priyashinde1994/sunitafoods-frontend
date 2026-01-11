import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../../services/models/order.model';
import { environment } from '../../../environments/environment'; // 👈 import environment

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, NgIf],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  orders$: Observable<Order[]>;

  constructor(private http: HttpClient) {
    this.orders$ = this.http.get<Order[]>(`${environment.apiUrl}api/orders/my`);
  }

}

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../../services/models/order.model';
import { environment } from '../../../environments/environment'; // 👈 import environment
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, NgIf],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  orders$: Observable<Order[]>;

  constructor(private http: HttpClient,public auth: AuthService, private router: Router) {
    this.orders$ = this.http.get<Order[]>(`${environment.apiUrl}api/orders/my`);
  }


logout(): void {
  this.auth.logout();
  this.router.navigate(['/login']);
}


}

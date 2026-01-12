import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, NgFor],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent {
  orderDetails$!: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public auth: AuthService,
    private router: Router   // ✅ inject Router
  ) {}

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.orderDetails$ = this.http.get(`${environment.apiUrl}api/orders/${orderId}`);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

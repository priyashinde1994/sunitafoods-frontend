import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  phone = '';   // ✅ new field
  error: string | null = null;
  success: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = null;
    this.success = null;

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone   // ✅ include phone
    };

    this.auth.register(payload).subscribe({
      next: (res: any) => {
        this.success = res.message;
        alert(this.success);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        alert(this.error);
      }
    });
  }
}

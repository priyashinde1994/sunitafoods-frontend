import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';   // ✅ add this

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],   // ✅ include RouterModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = null;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res && res.token) {
          this.auth.setSession(res.token, res.user);

          alert('Login successful');

          if (res.roles?.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.error = 'Invalid login response';
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
        alert(this.error);
      }
    });
  }
}

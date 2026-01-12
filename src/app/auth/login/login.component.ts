import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onSubmit() {
    this.error = null;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res && res.token) {
          this.auth.setSession(res.token, res.user);

          const role = res.user?.role || (res.roles?.[0] ?? '');
          if (role === 'admin' || role === 'ROLE_ADMIN') {
            this.snackBar.open('✅ Admin login successful', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.snackBar.open('✅ User login successful', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.router.navigate(['/home']);
          }
        } else {
          this.error = 'Invalid login response';
          this.snackBar.open(this.error, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
        this.snackBar.open(this.error ?? '', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }
}

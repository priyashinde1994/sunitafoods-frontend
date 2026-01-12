import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  phone = '';
  error: string = '';
  success: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone
    };

    this.auth.register(payload).subscribe({
      next: (res: any) => {
        this.success = res.message || '✅ Registration successful';
        this.snackBar.open(this.success, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Registration failed';
        this.snackBar.open(this.error, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}

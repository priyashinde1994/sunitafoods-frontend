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
  validationMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.validationMessage = '';
    this.error = '';
    this.success = '';

    // Manual validation (extra safety)
    if (!this.name || this.name.trim().length < 2) {
      this.validationMessage = '⚠️ Name must be at least 2 characters.';
      return;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(this.email)) {
      this.validationMessage = '⚠️ Please enter a valid email address.';
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.validationMessage =
        '⚠️ Password must be 8+ chars, include uppercase, lowercase, number, and special character.';
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(this.phone)) {
      this.validationMessage =
        '⚠️ Enter a valid 10-digit mobile number starting with 6–9.';
      return;
    }

    // ✅ Submit if all validations pass
    const payload = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
    };

    this.auth.register(payload).subscribe({
      next: (res: any) => {
        this.success = res.message || '✅ Registration successful';
        this.snackBar.open(this.success, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Registration failed';
        this.snackBar.open(this.error, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // 👈 import snackbar
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatSnackBarModule], // 👈 include snackbar module
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$!: Observable<any>;
  addresses$!: Observable<any[]>;
  addressForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public auth: AuthService,
    private snackBar: MatSnackBar   // 👈 inject snackbar
  ) {}

  ngOnInit(): void {
    this.user$ = this.http.get(`${environment.apiUrl}api/auth/me`);
    this.addresses$ = this.http.get<any[]>(`${environment.apiUrl}api/addresses`);

    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }


logout(): void {
  this.auth.logout();
  this.router.navigate(['/login']);
}

  addAddress(): void {
    if (this.addressForm.valid) {
      this.http.post(`${environment.apiUrl}api/addresses`, this.addressForm.value).subscribe({
        next: () => {
          this.addressForm.reset();
          this.addresses$ = this.http.get<any[]>(`${environment.apiUrl}api/addresses`);
          this.snackBar.open('✅ Address added successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        },
        error: err => {
          this.snackBar.open(
            '❌ Failed to add address: ' + (err.error?.message || err.statusText),
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );
        }
      });
    }
  }

  deleteAddress(id: number): void {
    this.http.delete(`${environment.apiUrl}api/addresses/${id}`).subscribe({
      next: () => {
        this.addresses$ = this.http.get<any[]>(`${environment.apiUrl}api/addresses`);
        this.snackBar.open('✅ Address deleted!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: err => {
        this.snackBar.open(
          '❌ Failed to delete address: ' + (err.error?.message || err.statusText),
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );
      }
    });
  }

  setDefaultAddress(addr: any): void {
    this.http.put(`${environment.apiUrl}api/addresses/${addr.id}/default`, {}).subscribe({
      next: () => {
        this.addressForm.patchValue({
          fullName: addr.fullName,
          phone: addr.phone,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          city: addr.city,
          state: addr.state,
          zipcode: addr.zipcode,
          country: addr.country
        });
        this.addresses$ = this.http.get<any[]>(`${environment.apiUrl}api/addresses`);
        this.snackBar.open('✅ Default address updated!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: err => {
        this.snackBar.open(
          '❌ Failed to set default: ' + (err.error?.message || err.statusText),
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );
      }
    });
  }
}

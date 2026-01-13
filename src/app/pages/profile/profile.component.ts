import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$!: Observable<any>;
  addresses$!: Observable<any[]>;
  addressForm!: FormGroup;

  states: string[] = [];
  cities: string[] = [];
  hometowns: string[] = [];

  // Hierarchical mapping: State → City → Hometown → Zip
  indiaData: any = {
    Maharashtra: {
      Mumbai: {
        Bhandup: '400078',
        Dadar: '400014',
        Dombivli: '421201',
        Ghatkopar: '400086',
        Kalyan: '421301',
        Kanjur: '400042',
        Kurla: '400070',
        Matunga: '400019',
        Mulund: '400080',
        Nahur: '400080',
        Sion: '400022',
        Thane: '400601',
        Vikhroli: '400083',
      },
      
    },
   
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    public auth: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user$ = this.http.get(`${environment.apiUrl}api/auth/me`);
    this.addresses$ = this.http.get<any[]>(`${environment.apiUrl}api/addresses`);

    this.states = Object.keys(this.indiaData);

    this.addressForm = this.fb.group({
      
      fullName: ['', Validators.required],
      phone: [ '', [ Validators.required, 
        Validators.pattern(/^[6-9]\d{9}$/) ]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      state: ['', Validators.required],
      city: ['', Validators.required],
      hometown: ['', Validators.required],
      zipcode: this.fb.control({ value: '', disabled: true }, Validators.required),
      country: this.fb.control({ value: 'India', disabled: true }, Validators.required),
    });
  }

  onStateChange(event: any) {
    const selectedState = event.target.value;
    this.cities = Object.keys(this.indiaData[selectedState] || {});
    this.hometowns = [];
    this.addressForm.patchValue({ city: '', hometown: '', zipcode: '' });
  }

  onCityChange(event: any) {
    const selectedState = this.addressForm.value.state;
    const selectedCity = event.target.value;
    this.hometowns = Object.keys(this.indiaData[selectedState]?.[selectedCity] || {});
    this.addressForm.patchValue({ hometown: '', zipcode: '' });
  }

  onHometownChange(event: any) {
    const selectedState = this.addressForm.value.state;
    const selectedCity = this.addressForm.value.city;
    const selectedHometown = event.target.value;
    const zip = this.indiaData[selectedState]?.[selectedCity]?.[selectedHometown] || '';
    this.addressForm.patchValue({ zipcode: zip });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  addAddress(): void {
    if (this.addressForm.valid) {
      // getRawValue() ensures disabled fields (country, zipcode) are included
      this.http
        .post(`${environment.apiUrl}api/addresses`, this.addressForm.getRawValue())
        .subscribe({
          next: () => {
            this.addressForm.reset({ country: 'India' });
            this.addresses$ = this.http.get<any[]>(`${environment.apiUrl}api/addresses`);
            this.snackBar.open('✅ Address added successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
          error: (err) => {
            this.snackBar.open(
              '❌ Failed to add address: ' + (err.error?.message || err.statusText),
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              }
            );
          },
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
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.snackBar.open(
          '❌ Failed to delete address: ' + (err.error?.message || err.statusText),
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
      },
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
          state: addr.state,
          city: addr.city,
          hometown: addr.hometown,
          zipcode: addr.zipcode,
          country: 'India',
        });
        this.addresses$ = this.http.get<any[]>(`${environment.apiUrl}api/addresses`);
        this.snackBar.open('✅ Default address updated!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        this.snackBar.open(
          '❌ Failed to set default: ' + (err.error?.message || err.statusText),
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
      },
    });
  }
}

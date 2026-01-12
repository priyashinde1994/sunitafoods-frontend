import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ import CommonModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  imports: [FormsModule, RouterModule,CommonModule], // ✅ add this
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  // Product model bound to form
  product: any = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    active: true
  };

  constructor(
    private adminService: AdminProductService,
    private router: Router
  ) {}

  goToDashboard(): void {
  this.router.navigate(['/admin/dashboard']);
}


  // Called when form is submitted
  addProduct(): void {
    this.adminService.add(this.product).subscribe({
      next: (res) => {
        console.log('Product added successfully:', res);
        // redirect back to product list
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error adding product:', err);
      }
    });
  }
}

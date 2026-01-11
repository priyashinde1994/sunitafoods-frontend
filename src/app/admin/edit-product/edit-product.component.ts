import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProductService } from '../../services/admin-product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  imports: [FormsModule, CommonModule]
})
export class EditProductComponent implements OnInit {
  product: any = null;
  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminProductService,
    private cdr: ChangeDetectorRef // ✅ inject this
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.adminService.getById(id).subscribe({
      next: (res) => {
        this.product = res;
        this.cdr.detectChanges(); // ✅ force Angular to update the view
      },
      error: (err) => console.error('Failed to load product', err)
    });
  }

  getImageUrl(path: string): string {
    return this.apiUrl.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
  }

  updateProduct(): void {
    if (!this.product?.id) return;
    this.adminService.update(this.product.id, this.product).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (err) => console.error('Update failed', err)
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}

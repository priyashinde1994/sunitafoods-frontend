import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  protected readonly title = signal('sunitafoods-frontend');

  constructor(private auth: AuthService, private router: Router) {}

 ngOnInit() {
  if (this.router.url === '/' || this.router.url === '') {
    this.router.navigate(['/home']);
  }
}

}

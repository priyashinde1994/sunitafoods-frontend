import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}api/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setSession(token: string, user?: any) {
    localStorage.setItem(this.tokenKey, token);
    if (user) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
  

  getUser(): any | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getRole(): string | null {
  const user = this.getUser();
  return user ? user.role : null;
}

}


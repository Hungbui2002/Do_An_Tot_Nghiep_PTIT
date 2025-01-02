import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../share/constants/url';
import { Observable } from 'rxjs';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  login(email: string, password: string): Observable<any> {
    const body = {
      Email: email,
      MatKhau: password,
    };
    return this.http.post<any>(BASE_URL + '/api/user/login', body, {
      headers: this.headers,
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(BASE_URL + '/api/user/register', userData, {
      headers: this.headers,
    });
  }

  setUserToLocalStorage(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUserFromLocalStorage() {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
  }

  logout() {
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }
}

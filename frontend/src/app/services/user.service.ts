import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../share/models/User';
import { BASE_URL } from '../share/constants/url';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(BASE_URL + '/api/user/getall', {
      headers: this.headers,
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(BASE_URL + '/api/user/delete/' + userId, {
      headers: this.headers,
    });
  }
}

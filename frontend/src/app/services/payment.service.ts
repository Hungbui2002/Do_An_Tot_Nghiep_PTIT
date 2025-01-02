import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../share/constants/url';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  getHistoryByUser(userId: string): Observable<any> {
    return this.http.get<any>(BASE_URL + '/api/invoice/getInvoice/' + userId, {
      headers: this.headers,
    });
  }

  createPayment(data: any): Observable<any> {
    return this.http.post<any>(BASE_URL + '/api/zalo/payment', data, {
      headers: this.headers,
    });
  }

  getAllInvoice(): Observable<any> {
    return this.http.get<any>(BASE_URL + '/api/invoice/getInvoice', {
      headers: this.headers,
    });
  }
}

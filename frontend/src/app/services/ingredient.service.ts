import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from '../share/models/Ingredient';
import { BASE_URL } from '../share/constants/url';
@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  getAllIngredient(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(
      BASE_URL + '/api/ingredientsPrice/getall',
      { headers: this.headers }
    );
  }

  createIngredient(data: any): Observable<any> {
    return this.http.post<any>(BASE_URL + '/api/ingredientsPrice/add', data, {
      headers: this.headers,
    });
  }

  updateIngredient(ingredientId: string, data: any): Observable<any> {
    return this.http.put<any>(
      BASE_URL + '/api/ingredientsPrice/update/' + ingredientId,
      data,
      { headers: this.headers }
    );
  }

  deleteIngredient(ingredientId: string): Observable<any> {
    return this.http.delete<any>(
      BASE_URL + '/api/ingredientsPrice/delete/' + ingredientId,
      { headers: this.headers }
    );
  }
}

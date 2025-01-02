import { Dish } from '../share/models/Dish';
import { PostIngredient } from '../share/models/postIngredient';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../share/constants/url';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  getAllDishByPage(page: number): Observable<any> {
    return this.http.get<any>(
      BASE_URL + '/api/dishes/getall' + `?page=${page}`,
      {
        headers: this.headers,
      }
    );
  }

  getAllDishByPageAndUser(userId: string, page: number): Observable<any> {
    return this.http.get<any>(
      BASE_URL + '/api/dishes/getall/' + userId + `?page=${page}`,
      { headers: this.headers }
    );
  }

  getAllDishByUser(userId: string): Observable<any> {
    return this.http.get<any>(
      BASE_URL + '/api/dishes/getallPurchase/' + userId,
      { headers: this.headers }
    );
  }
  getAllDish(): Observable<any> {
    return this.http.get<any>(BASE_URL + '/api/dishes/getallPurchase', {
      headers: this.headers,
    });
  }

  getDishById(dishId: string): Observable<Dish> {
    return this.http.get<Dish>(BASE_URL + '/api/dishes/step/' + dishId, {
      headers: this.headers,
    });
  }

  getDishByIdAndUser(dishId: string): Observable<Dish> {
    return this.http.get<Dish>(BASE_URL + '/api/dishes/stepAdmin/' + dishId, {
      headers: this.headers,
    });
  }

  getDetailDishByUser(dishId: string, userId: string): Observable<Dish> {
    return this.http.get<Dish>(
      BASE_URL + '/api/dishes/step/' + dishId + '/' + userId,
      { headers: this.headers }
    );
  }

  getDishByName(dishName: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(
      BASE_URL + '/api/dishes/search?TenMon=' + dishName,
      { headers: this.headers }
    );
  }
  getIngredientById(dishId: string): Observable<PostIngredient[]> {
    return this.http.get<PostIngredient[]>(
      BASE_URL + '/api/dishes/getIngredientsByDish/' + dishId,
      { headers: this.headers }
    );
  }

  createDish(body: any): Observable<any> {
    return this.http.post<any>(BASE_URL + '/api/dishes/add', body, {
      headers: this.headers,
    });
  }

  updateDish(dishId: string, body: any): Observable<any> {
    return this.http.put<any>(BASE_URL + '/api/dishes/update/' + dishId, body, {
      headers: this.headers,
    });
  }

  deleteDishById(dishId: string): Observable<any> {
    return this.http.delete<any>(BASE_URL + '/api/dishes/delete/' + dishId, {
      headers: this.headers,
    });
  }
}

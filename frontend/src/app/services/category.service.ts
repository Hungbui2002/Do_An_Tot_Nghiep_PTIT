import { Category } from 'src/app/share/models/Category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../share/constants/url';
import { Dish } from '../share/models/Dish';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'true',
  });

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(BASE_URL + '/api/category/getall', {
      headers: this.headers,
    });
  }

  getAllCategoryByUser(categoryId: string, userId: string): Observable<any> {
    return this.http.get<any>(
      BASE_URL + '/api/dishes/getDishesByCategory/' + categoryId + '/' + userId,
      {
        headers: this.headers,
      }
    );
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<Category>(BASE_URL + '/api/category/' + categoryId, {
      headers: this.headers,
    });
  }

  getAllDishByCategory(categoryId: string): Observable<any> {
    return this.http.get<any>(
      BASE_URL + '/api/dishes/getDishesByCategory/' + categoryId,
      { headers: this.headers }
    );
  }

  getDishBySearch(dishName: string, categoryId: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(
      BASE_URL +
        '/api/dishes/search?TenMon=' +
        dishName +
        '&&MaLoaiMon=' +
        categoryId,
      { headers: this.headers }
    );
  }

  createCategory(data: any): Observable<any> {
    return this.http.post<any>(BASE_URL + '/api/category/add', data, {
      headers: this.headers,
    });
  }

  updateCategory(categoryId: string, data: any): Observable<any> {
    return this.http.put<any>(
      BASE_URL + '/api/category/update/' + categoryId,
      data,
      { headers: this.headers }
    );
  }

  deleteCategory(categoryId: string): Observable<Category> {
    return this.http.delete<Category>(
      BASE_URL + '/api/category/delete/' + categoryId,
      {
        headers: this.headers,
      }
    );
  }
}

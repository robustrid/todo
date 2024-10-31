import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { Todo } from '../shared/interfaces/todo';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  updateTodo(todo: Todo): Observable<{ status: string; data: Todo }> {
    return this.http.put<{ status: string; data: Todo }>(`${this.apiUrl}`, todo, {
      headers: {
        'Authorization': `Bearer ${this.tokenService.getToken()}`,
      },
    });
  }

  getTodos(page: number, pageSize: number, completed: boolean): Observable<{ status: string; data: Todo[] }> {
    return this.http.get<{ status: string; data: Todo[] }>(`${this.apiUrl}?completed=${completed}&page=${page}&size=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.tokenService.getToken()}`
      }
    });
  }

  addTodo(todo: Todo): Observable<Todo> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    });

    return this.http.post<Todo>(this.apiUrl, todo, { headers });
  }
}

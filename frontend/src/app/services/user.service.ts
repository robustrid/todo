import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { LoginResponse } from '../shared/interfaces/login-response';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  register(userData: { name: string; email: string; password: string }): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/register`, userData).pipe(
      catchError((error) => throwError(error))
    );
  }

  login(userData: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, userData).pipe(
      catchError((error) => throwError(error))
    );
  }

  getUserDetails(): Observable<{ status: string; data: { name: string; completedCount: number; remainingCount: number } }> {
    return this.http.get<{ status: string; data: { name: string; completedCount: number; remainingCount: number } }>(`${this.apiUrl}/verify`, {
      headers: {
        'Authorization': `Bearer ${this.tokenService.getToken()}`,
      },
    });
  } 
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  appendURL = "api/auth";
  
  constructor(private http: HttpClient) { }

  getToken() {
    return sessionStorage.getItem('token');
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl+this.appendURL}/login`, credentials).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.user.role);
      })
    );
  }

  register(user: { name: string, email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl+this.appendURL}/register`, user);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

}

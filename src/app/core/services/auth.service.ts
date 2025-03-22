import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginUser, IUser } from '../../features/auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(user: IUser) {
    return this.http.post<ILoginUser>(`${this.apiUrl}/login`, user)
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user: IUser){
    return this.http.post<ILoginUser>(`${this.apiUrl}/register`, user)
  }

  getUserId(){
    const userId = JSON.parse(sessionStorage.getItem('user-id')!)
    return userId;
  }
}

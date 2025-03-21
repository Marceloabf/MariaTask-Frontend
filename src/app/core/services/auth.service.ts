import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ILoginUser, IUser } from '../../features/auth/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  userId: number  = 0;

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

  setUserId(userId: number){
    this.userId = userId
  }

  getUserId(){
    if(!this.userId) return;
    return this.userId
  }
}

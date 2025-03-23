import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ILoginUser,
  IUser,
} from '../../features/auth/interfaces/user.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.authEndpoint;

  constructor(private http: HttpClient) {}

  login(user: IUser) {
    return this.http.post<ILoginUser>(`${this.apiUrl}/login`, user);
  }

  register(user: IUser) {
    return this.http.post<ILoginUser>(`${this.apiUrl}/register`, user);
  }

  getUserId() {
    const userId = JSON.parse(sessionStorage.getItem('user-id')!);
    return userId;
  }
}

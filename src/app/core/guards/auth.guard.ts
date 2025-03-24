import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const token = sessionStorage.getItem('access-token');

    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;  
    }

    return true;
  }
}

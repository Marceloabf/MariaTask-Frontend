import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPhrase } from '../../features/tasks/interfaces/phrase.interface';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
private apiUrl = '/api/quotes';
  
constructor(private http: HttpClient) {}

getDailyPhrase(): Observable<IPhrase[]> {
  return this.http.get<IPhrase[]>(this.apiUrl);
}
}

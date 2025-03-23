import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITask } from '../../features/tasks/interfaces/task.interface';
import { ITaskReports } from '../../features/tasks/interfaces/task-reports.interface';
import { IPaginatedResponse } from '../../features/tasks/interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:3000/tasks';
  
    constructor(private http: HttpClient) {}
  
    getTasks(params: {userId: number, page: number, limit: number, status?: string}): Observable<IPaginatedResponse<ITask[]>> {
      return this.http.get<IPaginatedResponse<ITask[]>>(this.apiUrl, {params});
    }

    getTaskReports(userId: number): Observable<ITaskReports> {
      return this.http.get<ITaskReports>(`${this.apiUrl}/reports`, {params:{userId}});
    }
  
    createTask(task: ITask): Observable<ITask> {
      return this.http.post<ITask>(this.apiUrl, task);
    }
  
    updateTask(id: number, task: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, task);
    }
  
    deleteTask(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }

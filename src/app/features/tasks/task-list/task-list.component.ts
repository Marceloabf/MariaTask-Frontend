import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import $ from 'jquery';
import 'datatables.net';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { ITask } from '../interfaces/task.interface';
import { AuthService } from '../../../core/services/auth.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent implements OnInit {
  @ViewChild('taskTable', { static: false }) table!: ElementRef;

  tasks: ITask[] = []
  loading: boolean = false;
  visibleDialog: boolean = false;
  private userId: number | undefined = undefined
  constructor(private taskService: TaskService, private authService: AuthService){
  }

  ngOnInit(): void {
    this.getUserId();
    this.getUserTasks();
  }

  getUserId() {
    this.userId = this.authService.getUserId();
  }

  getUserTasks() {
    if (!this.userId) return;

    this.taskService.getTasks(this.userId).subscribe({
      next: (response) => {
        this.tasks = response ?? [];
        this.loading = false; 
        console.log(this.tasks)
      },
      error: (error: Error) => {
        console.error('Erro ao buscar tarefas do usuário:', error);
        this.loading = false; 
      }
    });
  }

  toggleDialog(){
    this.visibleDialog = !this.visibleDialog
    console.log(this.visibleDialog)
  }
}

import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import 'datatables.net';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';
import { ITask } from '../interfaces/task.interface';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MeterGroupModule } from 'primeng/metergroup';
import { ITaskReports } from '../interfaces/task-reports.interface';
import { PublicService } from '../../../core/services/public.service';
import { IPhrase } from '../interfaces/phrase.interface';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FloatLabelModule, FormsModule, TextareaModule, SelectModule, DatePickerModule, InputTextModule, ToastModule, MeterGroupModule, ConfirmPopupModule],
   providers: [MessageService, ConfirmationService],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent implements OnInit {
  @ViewChild('taskTable', { static: false }) table!: ElementRef;
  private userId: number | undefined = undefined

  tasks: ITask[] = []
  loading: boolean = false;
  visibleDialog: boolean = false;
  newTask = {
    title: '',
    description: '',
    status: 'PENDING',
    dueDate: '',
  };
  statusOptions = [{label: 'Pendente', value: 'PENDING'},{label: 'Em Andamento', value: 'IN_PROGRESS'},{label: 'Concluído', value: 'DONE'}]
  reportsValues = [
    { label: 'Pendente', color: '#34d399', value: 0, key: 'PENDING'},
    { label: 'Em Andamento', color: '#fbbf24', value: 0, key: 'IN_PROGRESS'},
    { label: 'Concluído', color: '#60a5fa', value: 0, key: 'DONE'},
  ];
  totalTasks: number = 0
  quote: string = ''
  author: string = ''
  isLoadingTaskCreation: boolean = false;
  constructor(private taskService: TaskService, private authService: AuthService, private messageService: MessageService, private publicService:  PublicService, private confirmationService: ConfirmationService){
  }

  ngOnInit(): void {
    this.getUserId();
    this.getUserTasks();
    this.getTaskReports();
    this.getDailyPhrase();
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

  createTask(){
    this.isLoadingTaskCreation = true;
    this.taskService.createTask(this.newTask).subscribe({
      next: () => {this.messageService.add({ severity: 'success', summary: 'Criado', detail: 'Atividade criada com sucesso' }), this.updateReportsStats()},
      error: (error: Error) => {
        console.error('Erro ao criar atividade:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar atividade' })
        this.isLoadingTaskCreation = false;
      },
      complete:() => {this.isLoadingTaskCreation = false; this.visibleDialog = false, this.getUserTasks()}
    })
  }

  updateReportsStats(){
    console.log('entrei')
    console.log(this.newTask.status);
    if(this.newTask.status === 'PENDING') this.reportsValues[0].value += 1;
    if(this.newTask.status === 'IN_PROGRESS') this.reportsValues[1].value += 1;
    if(this.newTask.status === 'DONE') this.reportsValues[2].value += 1;
    console.log({reportsValues:this.reportsValues})
  }

  getTaskReports() {
    if (!this.userId) return;
    
    this.taskService.getTaskReports(this.userId).subscribe({
      next: (response: ITaskReports) => {
        this.reportsValues = this.reportsValues.map(status => ({
          ...status,
          value: response[status.key]
        }));
        this.totalTasks = response.total
      },
      error: (error: Error) => {
        console.error('Erro ao gerar relatórios:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro buscar relatório' })
      }
    });
  }

  getDailyPhrase(){
    this.publicService.getDailyPhrase().subscribe({
      next: (response: IPhrase[]) => {
        this.quote = response[0].q ?? ''
        this.author = response[0].a ?? ''
      },
      error: (error: Error) => {
        console.error('Erro ao buscar frase:', error)
      }
    })
  }

  editTask(taskId: number){

  }

  confirmDeletion(event: Event) {
    console.log(event)
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this task?',
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            // this.taskService.deleteTask().subscribe({

            // })
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

  deleteTask(taskId: number){

  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import 'datatables.net';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MeterGroupModule } from 'primeng/metergroup';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { PublicService } from '../../../core/services/public.service';
import { TaskService } from '../../../core/services/task.service';
import { IPhrase } from '../interfaces/phrase.interface';
import { ITaskReports } from '../interfaces/task-reports.interface';
import { ITask } from '../interfaces/task.interface';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FloatLabelModule,
    FormsModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    ToastModule,
    MeterGroupModule,
    MessagesModule,
    BadgeModule,
    OverlayBadgeModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss',
})
export class TaskListComponent implements OnInit {
  @ViewChild('taskForm') form!: NgForm;
  private userId: number | undefined = undefined;

  tasks: ITask[] = [];
  visibleCreateDialog: boolean = false;
  visibleEditDialog: boolean = false;
  newTask = {
    title: '',
    description: '',
    status: 'PENDING',
    dueDate: '',
  };
  taskToUpdate = {
    id: 0,
    title: '',
    description: '',
    status: '',
    dueDate: new Date(),
  };
  statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
  ];
  reportsValues = [
    { label: 'Pending', color: '#dc3545', value: 0, key: 'PENDING' },
    { label: 'In Progress', color: '#fbbf24', value: 0, key: 'IN_PROGRESS' },
    { label: 'Done', color: '#34d399', value: 0, key: 'DONE' },
  ];
  quote: string = '';
  author: string = '';
  isLoadingTasks: boolean = false;
  isLoadingTaskCreation: boolean = false;
  isLoadingTaskEdition: boolean = false;
  isLoadingTaskDeletion: boolean = false;
  isLoadingReports: boolean = false;
  rowsPerPage: number =  10;
  page: number  = 1;
  totalRecords: number = 0;
  first: number = 1;
  filterStatus: string = '';
  constructor(
    private confirmationService: ConfirmationService,
    private taskService: TaskService,
    private authService: AuthService,
    private messageService: MessageService,
    private publicService: PublicService
  ) {}

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
    this.isLoadingTasks = true;

    this.taskService.getTasks({userId: this.userId, page: this.page, limit: this.rowsPerPage, status: this.filterStatus}).subscribe({
      next: (response) => {
        this.tasks = response.data ?? [];
        this.isLoadingTasks = false;
        this.totalRecords = response.total
      },
      error: (error: Error) => {
        console.error('Erro ao buscar tarefas do usuário:', error);
        this.isLoadingTasks = false;
      },
    });
  }

  toggleCreationDialog() {
    this.visibleCreateDialog = !this.visibleCreateDialog;
  }

  setEditionDialog(task: any) {
    this.visibleEditDialog = true;
    this.setTaskToUpdate(task);
  }

  setTaskToUpdate(task: any){
    const formattedDate = new Date(task.dueDate);
    this.taskToUpdate = task;
    this.taskToUpdate = {...this.taskToUpdate, dueDate:formattedDate};
  }

  clearFilters(){
    this.filterStatus = '';
    this.getUserTasks()
  }

  createTask() {
    if (!this.form.valid){
      this.messageService.add({
        severity: 'warning',
        summary: 'Verificar',
        detail: 'Campos: Title, Description, Status são obrigatórios',
      })
      return
    }
    this.isLoadingTaskCreation = true;
    
    this.taskService.createTask(this.newTask).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Criado',
          detail: 'Atividade criada com sucesso',
        }),

          this.incrementReportsStats();
          this.form.reset();
          this.newTask.status = 'PENDING'
      },
      error: (error: Error) => {
        console.error('Erro ao criar atividade:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar atividade',
        });
        this.isLoadingTaskCreation = false;
      },
      complete: () => {
        this.isLoadingTaskCreation = false;
        (this.visibleCreateDialog = false), this.getUserTasks();
      },
    });
  }

  incrementReportsStats() { 
    const updatedReports = this.reportsValues.map(item => ({
      ...item,
      value: item.key === this.newTask.status ? item.value + 1 : item.value
    }));
    this.totalRecords +=1;
    this.reportsValues = [...updatedReports];

  }

  decrementReportsStats(taskStatus: string) { 
    const updatedReports = this.reportsValues.map(item => ({
      ...item,
      value: item.key === taskStatus ? item.value - 1 : item.value
    }));
    this.totalRecords -=1;
    this.reportsValues = [...updatedReports];

  }

  getTaskReports() {
    if (!this.userId) return;
    this.isLoadingReports = true;

    this.taskService.getTaskReports(this.userId).subscribe({
      next: (response: ITaskReports) => {
        this.reportsValues = this.reportsValues.map((status) => ({
          ...status,
          value: response[status.key],
        }));
        this.isLoadingReports = false;
      },
      error: (error: Error) => {
        console.error('Erro ao gerar relatórios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro buscar relatório',
        });
      },
    });
  }

  getDailyPhrase() {
    this.publicService.getDailyPhrase().subscribe({
      next: (response: IPhrase[]) => {
        this.quote = response[0].q ?? '';
        this.author = response[0].a ?? '';
      },
      error: (error: Error) => {
        console.error('Erro ao buscar frase:', error);
      },
    });
  }

  onPageChange(event: TableLazyLoadEvent){
    this.page = event.first! / event.rows! + 1;
    this.rowsPerPage = event.rows!
    this.getUserTasks()
  }

  editTask() {
    this.isLoadingTaskEdition = true;

    this.taskService.updateTask(this.taskToUpdate.id, this.taskToUpdate).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Atualização',
          detail: 'Tarefa atualizada com sucesso',
        }),
        this.visibleEditDialog = false;
        this.getUserTasks();
        this.isLoadingTaskEdition = false;
      },
      error: (error: Error) => {
        console.error('Erro ao atualizar tarefa:', error)
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao ataualizar tarefa',
        });
        this.isLoadingTaskEdition = false;
      }
    })
  }

  confirmDeletion(taskId: number, taskStatus: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this task?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: !this.isLoadingTaskDeletion ? 'Delete' : 'Deleting...',
        severity: 'danger',
      },

      accept: () => {
        this.isLoadingTaskDeletion = true;
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: 'Task deleted',
            });
            this.isLoadingTaskDeletion = false;
            this.tasks = this.tasks.filter((task) => task.id !== taskId);
            this.decrementReportsStats(taskStatus);
          },
          error: (error: Error) => {
            console.error('Erro ao tentar deletar task:', error),
              (this.isLoadingTaskDeletion = false);
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rejected',
          detail: 'Task was not deleted',
        });
      },
    });
  }

  getStatusSeverity(status: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" | "help" | "primary" {
    switch (status) {
      case 'PENDING': return 'danger'; 
      case 'IN_PROGRESS': return 'warn'; 
      case 'DONE': return 'success'; 
      default: return 'secondary'; 
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'IN_PROGRESS': return 'In Progress';
      case 'DONE': return 'Done';
      default: return status;
    }
  }
}

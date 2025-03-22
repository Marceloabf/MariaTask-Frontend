import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  @ViewChild('taskTable', { static: false }) table!: ElementRef;
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
    { label: 'Pendente', value: 'PENDING' },
    { label: 'Em Andamento', value: 'IN_PROGRESS' },
    { label: 'Concluído', value: 'DONE' },
  ];
  reportsValues = [
    { label: 'Pendente', color: '#34d399', value: 0, key: 'PENDING' },
    { label: 'Em Andamento', color: '#fbbf24', value: 0, key: 'IN_PROGRESS' },
    { label: 'Concluído', color: '#60a5fa', value: 0, key: 'DONE' },
  ];
  totalTasks: number = 0;
  quote: string = '';
  author: string = '';
  isLoadingTasks: boolean = false;
  isLoadingTaskCreation: boolean = false;
  isLoadingTaskEdition: boolean = false;
  isLoadingTaskDeletion: boolean = false;
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

    this.taskService.getTasks(this.userId).subscribe({
      next: (response) => {
        this.tasks = response ?? [];
        this.isLoadingTasks = false;
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

    this.reportsValues = [...updatedReports];

  }

  decrementReportsStats(taskStatus: string) { 
    const updatedReports = this.reportsValues.map(item => ({
      ...item,
      value: item.key === taskStatus ? item.value - 1 : item.value
    }));

    this.reportsValues = [...updatedReports];

  }

  getTaskReports() {
    if (!this.userId) return;

    this.taskService.getTaskReports(this.userId).subscribe({
      next: (response: ITaskReports) => {
        this.reportsValues = this.reportsValues.map((status) => ({
          ...status,
          value: response[status.key],
        }));
        this.totalTasks = response.total;
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

  deleteTask(taskId: number) {}
}

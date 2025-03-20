import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import $ from 'jquery';
import 'datatables.net';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { ITask } from '../interfaces/task.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent implements OnInit {
  @ViewChild('taskTable', { static: false }) table!: ElementRef;

  tasks: ITask[] = []
  loading: boolean = false;
  private userId: number | undefined = undefined
  private isDataTableInitialized = false;
  constructor(private taskService: TaskService, private authService: AuthService, private cdr: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.getUserId();
    this.getUserTasks();
  }

  ngAfterViewInit() {
    // DataTable será inicializada após os dados estarem prontos
    this.initDataTable();
  }

  getUserId() {
    this.userId = this.authService.getUserId();
  }

  getUserTasks() {
    if (!this.userId) return;

    this.taskService.getTasks(this.userId).subscribe({
      next: (response) => {
        this.tasks = response ?? [];
        this.loading = false; // Desativa o loading quando os dados estiverem prontos
        this.cdr.detectChanges(); // Garante que a tabela será renderizada com os novos dados
        this.refreshDataTable(); // Atualiza a DataTable
      },
      error: (error: Error) => {
        console.error('Erro ao buscar tarefas do usuário:', error);
        this.loading = false; // Mesmo no erro, desativa o loading
      }
    });
  }

  initDataTable() {
    $(this.table.nativeElement).DataTable({
      paging: true,
      processing: true,
      pageLength: 10,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: true,
      autoWidth: false,
      language: {
        search: "Pesquisar:",
        lengthMenu: " _MENU_ registros por página",
        info: "_TOTAL_ registros",
        infoEmpty: "Nenhum registro disponível",
        zeroRecords: "Nenhum registro encontrado",
        paginate: {
          previous: "Anterior",
          next: "Próximo"
        }
      }
    });
  }

  refreshDataTable() {
    if ($.fn.DataTable.isDataTable(this.table.nativeElement)) {
      $(this.table.nativeElement).DataTable().clear().rows.add(this.tasks).draw(); 
    }
  }
}

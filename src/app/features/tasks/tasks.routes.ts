import { Routes } from '@angular/router';
import { TaskListComponent } from './task-board/task-board.component';

export const TASKS_ROUTES: Routes = [
  { path: '', component: TaskListComponent }
];

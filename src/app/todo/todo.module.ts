import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './container/content/content.component';
import { TodoDetailComponent } from './container/todo-detail/todo-detail.component';
import { TodoFormComponent } from './presentational/todo-form/todo-form.component';
import { TodoListComponent } from './presentational/todo-list/todo-list.component';

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: ':id', component: TodoDetailComponent },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [
    TodoFormComponent,
    TodoListComponent,
    ContentComponent,
    TodoDetailComponent,
  ],
})
export class TodoModule {}

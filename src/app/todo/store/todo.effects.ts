import { Injectable } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { TodoService } from '@app/core/services/todo.service';
import {
  loadAllTodosFinished,
  loading,
  addTodoFinished,
  setAsDoneFinished,
  deleteTodoFinished,
  loadSingleTodoFinished
} from './todo.reducer';
import { Todo } from '@app/models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoEffects {
  constructor(private todoService: TodoService) {}

  loadTodos = () =>
    this.todoService.getItems().pipe(
      map(payload => loadAllTodosFinished(payload)),
      // TODO handle error
      startWith(loading)
    );

  loadSingleTodo = (payload: string) =>
    this.todoService.getItem(payload).pipe(
      map(todo => loadSingleTodoFinished(todo)),
      // TODO handle error
      startWith(loading)
    );

  addTodo = (payload: string) =>
    this.todoService.addItem(payload).pipe(
      map(addedTodo => addTodoFinished(addedTodo)),
      // TODO handle error
      startWith(loading)
    );

  markAsDone = (payload: Todo) =>
    this.todoService.updateItem(payload).pipe(
      map(finishedTodo => setAsDoneFinished(finishedTodo)),
      // TODO handle error
      startWith(loading)
    );

  deleteTodo = (payload: Todo) =>
    this.todoService.deleteItem(payload).pipe(
      map(_ => deleteTodoFinished(payload)),
      // TODO handle error
      startWith(loading)
    );
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from '@app/models/todo';
import * as fromTodoStore from '@app/todo/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { useStore } from '../../store/store';
import { TodoState, getSelectedItem, TodoEffects } from '@app/todo/store';
import { ReducerTodoState } from '../../store/todo.reducer';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent {
  todo$: Observable<Todo>;

  constructor(
    private route: ActivatedRoute,
    private effects: TodoEffects
  ) {

    const { useEffect, useState } = useStore<TodoState, ReducerTodoState>(
      'todo'
    );

    this.todo$ = useState(getSelectedItem);
    const id = this.route.snapshot.params.id;

    useEffect(() => this.effects.loadSingleTodo(id));
  }
}



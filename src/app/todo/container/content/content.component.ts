import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { Todo } from '@app/models/todo';
import {
  getAllDoneItems,
  getAllUndoneItems,
  TodoState,
  TodoEffects,
} from '@app/todo/store';
import { Observable, Subject } from 'rxjs';
import { useStore } from '@app/todo/store/store';
import { takeUntil } from 'rxjs/operators';
import { ReducerTodoState, initialState } from '@app/todo/store/todo.reducer';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnDestroy {

  destroying$ = new Subject();
  items$: Observable<Todo[]>;
  doneItems$: Observable<Todo[]>;

  addTodo$ = new EventEmitter<string>();
  markAsDone$ = new EventEmitter<Todo>();
  deleteTodo$ = new EventEmitter<Todo>();

  constructor(private effects: TodoEffects) {
    const { useEffect, useState } = useStore<TodoState, ReducerTodoState>(
      'todo',
      initialState
    );
    this.items$ = useState(getAllUndoneItems);
    this.doneItems$ = useState(getAllDoneItems);
    useEffect(this.effects.loadTodos);

    this.addTodo$.pipe(takeUntil(this.destroying$)).subscribe(addedTodo => useEffect(() => this.effects.addTodo(addedTodo)));
    this.markAsDone$.pipe(takeUntil(this.destroying$)).subscribe(doneTodo => useEffect(() => this.effects.markAsDone(doneTodo)));
    this.deleteTodo$.pipe(takeUntil(this.destroying$)).subscribe(toDelete => useEffect(() => this.effects.deleteTodo(toDelete)));
  }

  ngOnDestroy() {
    this.destroying$.next();
    this.destroying$.complete();
  }
}

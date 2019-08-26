import { TestBed } from '@angular/core/testing';
import { TodoEffects } from './todo.effects';
import { TodoService } from '@app/core/services/todo.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject, of } from 'rxjs';
import { loadAllTodos, loadAllTodosFinished } from './todo.actions';
import { cold } from 'jest-marbles';

describe('Todo effects tests', () => {
  let actions: Observable<any>;
  let effect: TodoEffects;
  let todoService: TodoService;

  const mockTodoService = () => {
    return { getItems: jest.fn() };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoEffects,
        { provide: TodoService, useFactory: mockTodoService },
        provideMockActions(() => {
          return actions;
        })
      ]
    });
    todoService = TestBed.get(TodoService);
    effect = TestBed.get(TodoEffects);
  });

  it('it should load loadAllTodosFinished on loadAllTodos action', () => {
    // arrange
    actions = new ReplaySubject(1);
    effect.loadTodos$.subscribe();
    const spy = jest.spyOn(todoService, 'getItems');
    // act
    (actions as ReplaySubject<any>).next(loadAllTodos());
    // assert
    expect(spy).toHaveBeenCalled();
  });

  it('it should dispatch loadAllTodosFinished when call was successfull', () => {
    // arrange
    const expected$ = cold('a', {
      a: loadAllTodosFinished({ payload: [] }),
    });
    const spy = jest.spyOn(todoService, 'getItems').mockReturnValueOnce(of([]));
    // act
    actions = cold('a', { a: loadAllTodos() });
    // assert
    expect(effect.loadTodos$).toBeObservable(expected$);
  });

  it('it should dispatch eror when call was successfull', () => {
    // arrange
    const expected$ = cold('#', {
      '#': { error: new Error('error') },
    });
    const spy = jest.spyOn(todoService, 'getItems').mockImplementation(() => { throw new Error('error'); });
    // act
    actions = cold('a', { a: loadAllTodos() });
    // assert
    expect(effect.loadTodos$).toBeObservable(expected$);
  });
});

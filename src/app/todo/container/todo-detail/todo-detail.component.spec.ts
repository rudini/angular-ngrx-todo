import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoDetailComponent } from './todo-detail.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store, Action, MemoizedSelector } from '@ngrx/store';
import * as fromTodoStore from '@app/todo/store';
import { TodoState } from '@app/todo/store';
import { Todo } from '@app/models/todo';

describe('TodoDetailComponent', () => {
  let testee: TodoDetailComponent;
  let fixture: ComponentFixture<TodoDetailComponent>;
  const initialState = {
    todo: {
      items: [],
      selectedItem: null,
      loading: false
    }
  };
  let store: MockStore<TodoState>;
  let selectedItemSelector: MemoizedSelector<TodoState, Todo>;
  let dispatchSpy: jest.SpyInstance<void, [Action]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [TodoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '123' } } }
        },
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    selectedItemSelector = store.overrideSelector(
      fromTodoStore.getSelectedItem,
      {} as Todo
    );
    dispatchSpy = jest.spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoDetailComponent);
    testee = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(testee).toBeTruthy();
  });

  // this was the old test without mocked store
  // it('service should have been called', () => {
  //   const spy = spyOn(service, 'getItem');
  //   fixture.detectChanges();
  //   expect(spy).toHaveBeenCalledWith('123');
  // });

  it('it should dispatch loadSingleTodo action when creating', () => {
    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: '123',
      type: '[Todo] Load Single Todo'
    });
  });

  it('it should display the id of the todo item', () => {
    selectedItemSelector.setResult({ id: 'this is an id'} as Todo);
    fixture.detectChanges();
    const node: HTMLElement = fixture.elementRef.nativeElement;
    expect(node.querySelector('[data-test="todo_id"]').innerHTML).toBe('this is an id');
  });

  it('it should display the value of the todo item', () => {
    selectedItemSelector.setResult({ value: 'this is the value'} as Todo);
    fixture.detectChanges();
    const node: HTMLElement = fixture.elementRef.nativeElement;
    expect(node.querySelector('[data-test="todo_value"]').innerHTML).toBe('this is the value');
  });
});

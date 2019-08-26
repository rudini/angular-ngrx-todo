import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, Action, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ContentComponent } from './content.component';
import { TodoFormComponent } from '@app/todo/presentational/todo-form/todo-form.component';
import { TodoListComponent } from '@app/todo/presentational/todo-list/todo-list.component';
import { TodoState } from '@app/todo/store';
import { Todo } from '@app/models/todo';
import * as fromTodoStore from '@app/todo/store';
import { cold } from 'jest-marbles';
import { TestStore } from '@app/shared/mock.store';

describe('ContentComponent', () => {
  let testee: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  const initialState = {
    todo: {
      items: [],
      selectedItem: null,
      loading: false
    }
  };
  let getAllUndoneItemsSelector: MemoizedSelector<TodoState, Todo[]>;
  let getAllDoneItemsSelector: MemoizedSelector<TodoState, Todo[]>;
  let store: MockStore<TodoState>;
  let dispatchSpy: jest.SpyInstance<void, [Action]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [provideMockStore({ initialState })],
      declarations: [ContentComponent, TodoFormComponent, TodoListComponent]
    }).compileComponents();

    store = TestBed.get(Store);
    getAllUndoneItemsSelector = store.overrideSelector(
      fromTodoStore.getAllUndoneItems,
      [] as Todo[]
    );
    getAllDoneItemsSelector = store.overrideSelector(
      fromTodoStore.getAllDoneItems,
      [] as Todo[]
    );
    dispatchSpy = jest.spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    testee = fixture.componentInstance;
  });

  it('it should create', () => {
    // act
    fixture.detectChanges();
    // assert
    expect(testee).toBeTruthy();
  });

  it('it should dispatch loadAllTodos', () => {
    // act is the creation of the testee component
    // assert
    expect(dispatchSpy).toHaveBeenCalledWith(fromTodoStore.loadAllTodos());
  });

  it('it should emit values to the items$ when data has been loaded', () => {
    // act
    getAllUndoneItemsSelector.setResult([
      { id: '1', value: 'this is a value' },
      { id: '2', value: 'this is another value' }
    ] as Todo[]);
    // assert
    expect(testee.items$).toBeObservable(
      cold('a', {
        a: [
          { id: '1', value: 'this is a value' },
          { id: '2', value: 'this is another value' }
        ]
      })
    );
  });

  it('it should dispatch addTodo action when adding a todo', () => {
    // act
    testee.addTodo('a new item');
    // assert
    expect(dispatchSpy).toHaveBeenCalledWith(
      fromTodoStore.addTodo({ payload: 'a new item' })
    );
  });

 // !moved to todo-list.component.spec
  // it('it should display all undone items', () => {
  //   // arrange
  //   getAllUndoneItemsSelector.setResult([
  //     { id: '1', value: 'this is a value' },
  //     { id: '2', value: 'this is another value' }
  //   ] as Todo[]);
  //   // act
  //   fixture.detectChanges();
  //   const node: HTMLElement = fixture.elementRef.nativeElement;
  //   // assert
  //   expect(
  //     node.querySelector('[data-test="todo-undone_1"]').innerHTML
  //   ).toContain('this is a value');
  //   expect(
  //     node.querySelector('[data-test="todo-undone_2"]').innerHTML
  //   ).toContain('this is another value');
  // });


  it('it should dispatch loadAllTodos w/o Testbed', () => {
    // arrange
    const storeMock: any = new TestStore();
    dispatchSpy = jest.spyOn(store, 'dispatch');
    // act
    new ContentComponent(storeMock);
    // assert
    expect(dispatchSpy).toHaveBeenCalledWith(fromTodoStore.loadAllTodos());
  });


  it('it should emit values to the items$ when data has been loaded w/o Testbed', () => {
    // arrange
    const storeMock = new TestStore([{
      selector: fromTodoStore.getAllUndoneItems, value: [
          { id: '1', value: 'this is a value' },
          { id: '2', value: 'this is another value' }
        ] as Todo[] }]);
    // act
    const testeewo = new ContentComponent(storeMock);
    // assert
    expect(testeewo.items$).toBeObservable(
      cold('a', {
        a: [
          { id: '1', value: 'this is a value' },
          { id: '2', value: 'this is another value' }
        ]
      })
    );
  });
});

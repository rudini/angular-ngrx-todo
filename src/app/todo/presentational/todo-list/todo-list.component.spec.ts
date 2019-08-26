import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoListComponent } from './todo-list.component';
import { Todo } from '@app/models/todo';

describe('TodoListComponent', () => {
  let testee: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TodoListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    testee = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(testee).toBeTruthy();
  });

  it('it should display all undone items', () => {
    // arrange
    testee.items = [
      { id: '1', value: 'this is a value' },
      { id: '2', value: 'this is another value' }
    ] as Todo[];
    // act
    fixture.detectChanges();
    const node: HTMLElement = fixture.elementRef.nativeElement;
    // assert
    expect(
      node.querySelector('[data-test="todo-undone_1"]').innerHTML
    ).toContain('this is a value');
    expect(
      node.querySelector('[data-test="todo-undone_2"]').innerHTML
    ).toContain('this is another value');
  });
});

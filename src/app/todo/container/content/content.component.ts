import { Component, OnInit } from '@angular/core';
import { Todo } from '@app/models/todo';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  items$: Observable<Todo[]>;
  doneItems$: Observable<Todo[]>;

  constructor(/*inject store*/) {
    // todo: select data from store
  }

  addTodo(item: string) {
    // todo: dispatch action
  }

  markAsDone(item: Todo) {
    // todo: dispatch action
  }

  deleteItem(item: Todo) {
    // todo: dispatch action
  }
}

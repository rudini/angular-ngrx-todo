import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from '@app/models/todo';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent {
  todo$: Observable<Todo>;

  constructor(
    private route: ActivatedRoute,
    /*inject store*/
  ) {
    // todo: select data from store
    const id = this.route.snapshot.params.id;
    // todo: dispatch action
  }
}

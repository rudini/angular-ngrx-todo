import { Observable } from 'rxjs';
import { cold } from 'jest-marbles';
import { Store, ActionsSubject, ReducerManager, ReducerManagerDispatcher } from '@ngrx/store';
import { MockStore, provideMockStore, MockState, MockSelector } from '@ngrx/store/testing';

export class TestStore extends MockStore<any> {
  constructor(private selectorMap: MockSelector[] = []) {
    super(
      new MockState(),
      new ActionsSubject(),
      new ReducerManager(null, {}, {}, () => null),
      {},
      selectorMap,
      );
  }

  dispatch(action: any): void {
  }
}

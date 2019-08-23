import { Observable } from 'rxjs';
import { cold } from 'jest-marbles';

export class MockStoreImpl {
  constructor(private selectorMap: { selector: any; value: Observable<any> }[] = []) {}

  public dispatch(action: any): void {
  }

  public pipe(selectfn: () => any) {
    const selector = selectfn.arguments[0];
    const found = this.selectorMap.filter(x => x.selector === selector);
    if (found.length !== 0) {
        return found[0].value;
    }
    return cold('a', { a: {} });
  }

  // public select(selector: any): Observable<any> {
  //     const found = this.selectorMap.filter(x => x.selector === selector);
  //     if (found.length !== 0) {
  //         return found[0].value;
  //     }
  //     return cold('a', { a: {} });
  // }
}

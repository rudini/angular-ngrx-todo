# Installieren der Paktete und Anlegen der Dateien und Ordner
1. npm install @ngrx/store @ngrx/effects
2. Ordner "state" erstellen unter _./src/app/todo_

# Erstellen des States
Als Nächstes müssen wir den State des Featuremoduls erstellen. Der State ist nur ein JavaScript-Objekt, das alles speichern soll, was wir im State ablegen wollen. In dem Fall sind das nur unsere To-do-Items und – falls es dies gibt – das gerade ausgewählte To-do-Item. In der Datei _todo.reducer.ts_ findet unser State seinen Platz:

```typescript
export interface ReducerTodoState {
  items: Todo[];
  selectedItem: Todo;
}
```

# InitialState erstellen
Interfaces sind in TypeScript passend für Typsicherheit, somit können wir einen initialState erstellen, der uns das geschriebene Interface erfüllt und die Properties mit den Standardwerten initialisiert.

```typescript
export const initialState: ReducerTodoState = {
  items: [],
  selectedItem: null,
};
```

# Definieren der Actions
States können nur mit Actions verändert werden. Somit müssen wir im nächsten Schritt die Actions definieren, die wir an den Store applizieren wollen, um ein neues State-Objekt erhalten zu können
In einer erstellten Datei _todo/state/todo.actions.ts_ definieren wir alle Actions, welche in unserer TODO Applikation vorkommen können.

```typescript
export const loadAllTodos = createAction('[Todo] Load Todos');

export const loadAllTodosFinished = createAction(
  '[Todo] Load Todos Finished',
  props<{ payload: Todo[] }>()
);

export const loadSingleTodo = createAction(
  '[Todo] Load Single Todo',
  props<{ payload: string }>()
);

export const loadSingleTodoFinished = createAction(
  '[Todo] Load Single Todo Finished',
  props<{ payload: Todo }>()
);

export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ payload: string }>()
);
export const addTodoFinished = createAction(
  '[Todo] Add Todo Finished',
  props<{ payload: Todo }>()
);

export const setAsDone = createAction(
  '[Todo] SetAsDone',
  props<{ payload: Todo }>()
);

export const setAsDoneFinished = createAction(
  '[Todo] SetAsDone Finished',
  props<{ payload: Todo }>()
);

export const deleteTodo = createAction(
  '[Todo] DeleteTodo',
  props<{ payload: Todo }>()
);

export const deleteTodoFinished = createAction(
  '[Todo] DeleteTodo Finished',
  props<{ payload: Todo }>()
);
```

# Hinzufügen eines Reducers
Mit einem State und den passenden Actions können wir nun einen Reducer schreiben. Ein Reducer ist nichts anderes als eine Funktion, die einen State (ReducerTodoState) und eine Action (Typ TodoActions) als Parameter erhält und einen neuen State (ReducerTodoState) zurückgibt. Ein Reducer ist der einzige Punkt unserer Applikation, in dem ein neues State-Objekt erzeugt wird. Jede Änderung an einem State geht von einem Reducer aus.
In der Datei _store/todo.reducer.ts_ definieren wir den Reducer mittels der createReducer function:

```typescript
const todoReducerInternal = createReducer(
  initialState,
  on(
    todoActions.addTodo,
    todoActions.deleteTodo,
    todoActions.loadAllTodos,
    todoActions.loadSingleTodo,
    todoActions.setAsDone,
    state => ({
      ...state,
      loading: true
    })
  ),
  on(todoActions.addTodoFinished, (state, { payload }) => ({
    ...state,
    loading: false,
    items: [...state.items, payload]
  })),
  on(todoActions.loadAllTodosFinished, (state, { payload }) => ({
    ...state,
    loading: false,
    items: [...payload]
  })),
  on(todoActions.loadSingleTodoFinished, (state, { payload }) => ({
    ...state,
    loading: false,
    selectedItem: payload
  })),
  on(todoActions.deleteTodoFinished, (state, { payload }) => ({
    ...state,
    loading: false,
    items: [...state.items.filter(x => x !== payload)]
  })),
  on(todoActions.setAsDoneFinished, (state, { payload }) => {
    const index = state.items.findIndex(x => x.id === payload.id);

    state.items[index] = payload;

    return {
      ...state
    };
  })
);
```

!!!! Es muss immer einen neuen State zurückgegeben werden. Der State darf nicht verändert werden. Durch die Verwendung der createReducer Funktion muss kein Default State mehr zurückgegeben werden wie bei früheren Versionen mit switch case reducers.

Damit das ganze auch mittels AOT compiliert werden kann muss eine "statische" function von der Signatur (state, action) => state exportiert werden, welche unsere interne Reducer Funktion aufruft.

```typescript
export function todoReducer(
  state: ReducerTodoState | undefined,
  action: Action
) {
  return todoReducerInternal(state, action);
}
```

# Asynchrones Arbeiten mit Effects
Vor dem Hintergrund, dass Reducer immer dasselbe Ergebnis bei denselben Parametern geben, haben wir das Problem der Seiteneffekte; angenommen, wir würden HTTP-Kommunikation in den Reducer setzen, wäre das Ergebnis nicht mehr vorhersagbar. Denn wie der Server reagiert (Ergebnis 404/500/200/…), wissen wir nicht. Somit wäre das Ergebnis nicht mehr absehbar und der Reducer würde eventuell auch bei demselben Input unterschiedliche Ergebnisse bringen. Weiter sind Reducer immer synchron, HTTP-Kommunikation ist allerdings asynchron.

Wir können somit asynchrone Operationen in von NgRx angebotene Effects auslagern. Sie bieten uns eine Stelle für HTTP-Kommunikation oder jede andere Art von asynchronem Verhalten.

Wir erstellen eine neue Datei _todo.effects.ts_ und eine Klasse TodoEffects. Wir dekorieren diese Klasse mit dem Decorator @Injectable(), da die Klasse einen Actions-Typ injiziert bekommt und einen Service zur HTTP-Kommunikation.

```typescript
@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private todoService: TodoService) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.loadAllTodos),
      switchMap(action =>
        this.todoService.getItems().pipe(
          map(todos => todoActions.loadAllTodosFinished({ payload: todos })),
          catchError(error => of(error))
        )
      )
    )
  );

  loadSingleTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.loadSingleTodo),
      map(action => action.payload),
      switchMap(payload =>
        this.todoService.getItem(payload).pipe(
          map(todo => todoActions.loadSingleTodoFinished({ payload: todo })),
          catchError(error => of(error))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.addTodo),
      map(action => action.payload),
      switchMap(payload =>
        this.todoService.addItem(payload).pipe(
          map(todo => todoActions.addTodoFinished({ payload: todo })),
          catchError(error => of(error))
        )
      )
    )
  );

  markAsDone$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.setAsDone),
      map(action => action.payload),
      switchMap(payload =>
        this.todoService.updateItem(payload).pipe(
          map(todo => todoActions.setAsDoneFinished({ payload: todo })),
          catchError(error => of(error))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(todoActions.deleteTodo),
      map(action => action.payload),
      switchMap(payload =>
        this.todoService.deleteItem(payload).pipe(
          map(_ => todoActions.deleteTodoFinished({ payload })),
          catchError(error => of(error))
        )
      )
    )
  );
}
```


# State Selector anbieten
Damit wir in den Components möglichst wenig Mapping und Transformationslogik implementieren müssen, können wir Selektoren verwenden, welche diese Arbeit erledigen.

Da wir uns in einem Featuremodul befinden, registrieren wir später den Feature-State unter einem bestimmten Property, das wir jetzt schon als String definieren können: _export const featureStateName = ‚todoFeature‘_;

Wir definieren deshalb in der Datei _todo.selector.ts_ den feature state namen:

```typescript
export const featureStateName = 'todoFeature';
```

Wir erstellen ein neues Objekt, auf dem wir den Reducer auf ein Property mappen. Falls wir im Todo-Feature mehrere Reducer haben sollten, können wir dieses Objekt erweitern. Um typsicher zu bleiben, definieren wir zusätzlich ein Interface für den TodoState mit dem Property todo, das den Typ des Reducers ReducerTodoState erhält. Das Objekt hat den Typ ActionReducerMap, der generisch ist. In diesem Fall geben wir das Interface TodoState als Typ. Somit haben wir ein Objekt für das Featuremodul, das mit zukünftigen Reducern erweiterbar ist

```typescript
export interface TodoState {
  todo: ReducerTodoState;
}

export const todoReducers: ActionReducerMap<TodoState> = {
  todo: todoReducer
};
```

Um nun Selektoren für unser FeatureModules zu erstellen benötigen wir noch ein Funktion, welche das Property unseres Featurestates aus dem State zurückgibt. 

```typescript
export const getTodoFeatureState = createFeatureSelector<TodoState>(
  featureStateName
);
```

Nun können wir die benötigten Selektoren implementieren:

```typescript
export const getAllUndoneItems = createSelector(
  getTodoFeatureState,
  (state: TodoState) => state.todo.items.filter(x => !x.done)
);

export const getAllDoneItems = createSelector(
  getTodoFeatureState,
  (state: TodoState) => state.todo.items.filter(x => x.done)
);

export const getSelectedItem = createSelector(
  getTodoFeatureState,
  (state: TodoState) => state.todo.selectedItem
);
```

# Index Datei erstellen
Nun erstellen wir eine _index.ts_ Datei, welche die internen Module exportiert:

```typescript
export * from './todo.actions';
export * from './todo.effects';
export * from './todo.reducer';
export * from './todo.selectors';
```


# State mit dem Modul verbinden und Form des State Objects
Unser Store ist nun fertig. Wir müssen diesen nur noch auf unserem Modul registrieren. Wir können Stores auf dem Root-Modul (AppModule) mit Storemodule.forRoot({ … }) und auf Featuremodulen mit StoreModule.forFeature(’nameOfFeature‘, { … }) registrieren. Die Effekte müssen wir ebenfalls registrieren. Hierfür gibt es die Methoden EffectsModule.forRoot([ … ]) oder EffectsModule.forFeature([ … ]).

Da wir in diesem Fall in einem Featuremodul arbeiten und der State über die komplette Applikation nur ein JavaScript-Objekt ist, können wir genau dieses JavaScript-Objekt auf dem Appmodul registrieren. Die Effekte auf root-level sind in diesem Beispiel ebenfalls nicht genutzt, also stellen wir ein leeres Array zur Verfügung.

So sollte das imports Array in der _app.module_ Datei aussehen:

```typescript
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
  ],
```


Auf das Featuremodul TodoModule registrieren wir den State und die Effects mit forFeature(…). StoreModule.forFeature(’nameOfFeature‘, { … }) registriert nun ein neues Property auf dem Root State mit dem Namen des Features. In unserem Fall exportieren wir es aus der index.ts-Datei und es heißt export const featureStateName = ‚todoFeature‘;

So sollte das _todo.module.ts_ danach aussehen:

```typescript
const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: ':id', component: TodoDetailComponent },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(featureStateName, todoReducers),
    EffectsModule.forFeature([TodoEffects]),
  ],
  exports: [],
  declarations: [
    TodoFormComponent,
    TodoListComponent,
    ContentComponent,
    TodoDetailComponent,
  ],
})
export class TodoModule {}
```


# State in einer Component konsumieren

Da wir nun den State und die Selectors demystifiziert haben, können wir den Store in unseren Components injecten und ihn verwenden.

Wollen wir nun den Store dazu bringen, alle To-do-Items abzufragen – dazu hören wir in den Effects auf eine GetAllTodos Action – können wir sie mit der Funktion dispatch(…) an den Store applizieren:

```typescript
this.store.dispatch(new LoadAllTodosAction());
```


Um Daten aus dem Store zu selektieren können wir die Selektoren wie folgt benutzen:

```typescript
this.items$ = this.store.pipe(select(getAllUndoneItems));
```

import { Todo } from '../../models/todo';

export interface ReducerTodoState {
  items: Todo[];
  selectedItem: Todo;
  loading: boolean;
}

export const initialState: ReducerTodoState = {
  items: [],
  selectedItem: null,
  loading: false
};

export const loading = (state: ReducerTodoState) =>
  ({
    ...state,
    loading: true
  } as ReducerTodoState);

export const loadAllTodosFinished = (payload: Todo[]) => (
  state: ReducerTodoState
) =>
  ({
    ...state,
    loading: false,
    items: [...payload]
  } as ReducerTodoState);

export const addTodoFinished = (payload: Todo) => (state: ReducerTodoState) =>
  ({
    ...state,
    loading: false,
    items: [...state.items, payload]
  } as ReducerTodoState);

export const loadSingleTodoFinished = (payload: Todo) => (
  state: ReducerTodoState
) =>
  ({
    ...state,
    loading: false,
    selectedItem: payload
  } as ReducerTodoState);

export const setAsDoneFinished = (payload: Todo) => (
  state: ReducerTodoState
) => {
  const index = state.items.findIndex(x => x.id === payload.id);
  state.items[index] = payload;
  return {
    ...state
  };
};

export const deleteTodoFinished = (payload: Todo) => (
  state: ReducerTodoState
) => ({
  ...state,
  loading: false,
  items: [...state.items.filter(x => x !== payload)]
});

import { ReducerTodoState } from './todo.reducer';

// export const featureStateName = 'todoFeature';

export interface TodoState {
  todo: ReducerTodoState;
}

export const getAllUndoneItems = (state: ReducerTodoState) => state.items.filter(x => !x.done);
export const getAllDoneItems = (state: ReducerTodoState) => state.items.filter(x => x.done);
export const getSelectedItem = (state: ReducerTodoState) => state.selectedItem;

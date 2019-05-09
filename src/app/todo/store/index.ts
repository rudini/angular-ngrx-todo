import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';
import { ReducerTodoState, todoReducer } from './todo.reducer';

export const featureStateName = 'todoFeature';

export interface CompleteTodoModuleState {
  todo: ReducerTodoState;
}

export const allTodoReducers: ActionReducerMap<CompleteTodoModuleState> = {
  todo: todoReducer
};

export const getTodoFeatureState = createFeatureSelector<
  CompleteTodoModuleState
>(featureStateName);

export const getAllUndoneItems = createSelector(
  getTodoFeatureState,
  (state: CompleteTodoModuleState) => state.todo.items.filter(x => !x.done)
);

export const getAllDoneItems = createSelector(
  getTodoFeatureState,
  (state: CompleteTodoModuleState) => state.todo.items.filter(x => x.done)
);

export const getSelectedItem = createSelector(
  getTodoFeatureState,
  (state: CompleteTodoModuleState) => state.todo.selectedItem
);

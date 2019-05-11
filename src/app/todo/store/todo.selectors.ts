import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReducerTodoState } from './todo.reducer';

export const featureStateName = 'todoFeature';

export const getTodoFeatureState = createFeatureSelector<ReducerTodoState>(
  featureStateName
);

export const getAllUndoneItems = createSelector(
  getTodoFeatureState,
  (state: ReducerTodoState) => state.items.filter(x => !x.done)
);

export const getAllDoneItems = createSelector(
  getTodoFeatureState,
  (state: ReducerTodoState) => state.items.filter(x => x.done)
);

export const getSelectedItem = createSelector(
  getTodoFeatureState,
  (state: ReducerTodoState) => state.selectedItem
);

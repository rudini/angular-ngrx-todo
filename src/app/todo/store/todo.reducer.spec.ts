import { todoReducer } from './todo.reducer';
import { loadAllTodos, loadAllTodosFinished } from './todo.actions';
import { Todo } from '@app/models/todo';

describe('todo reducer tests', () => {
  describe('on loadAllTodos', () => {
    it('it should set the loading state to true', () => {
      expect(
        todoReducer(undefined, loadAllTodos()).loading
      ).toEqual(true);
    });
  });

  describe('on loadAllTodosFinished', () => {
    it('it should set the loading state to false', () => {
      expect(
        todoReducer(undefined, loadAllTodosFinished({ payload: [] as Todo[] })).loading
      ).toEqual(false);
    });

    it('it should set the items state to the returned Todos', () => {
      expect(
        todoReducer(undefined, loadAllTodosFinished({ payload: [{ id: '1' }] as Todo[] })).items
      ).toEqual([{ id: '1' }] as Todo[]);
    });
  });
});

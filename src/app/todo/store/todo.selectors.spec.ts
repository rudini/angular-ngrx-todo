import { getAllDoneItems } from './todo.selectors';

describe('selectors test', () => {
  describe('getAllDoneItems', () => {
    it('it should filter out undone items', () => {
      expect(getAllDoneItems.projector({ todo: { items: [ { id: 'undone', done: false }, { id: 'done', done: true }  ] }}))
      .toStrictEqual([{ id: 'done', done: true }]);
    });
  });
});

/* tslint:disable:no-unused-variable */

import { InterceptableStore, InterceptableStoreFactory } from './interceptable-store';

describe('InterceptableStore', () => {
  it('should create an instance', () => {
    expect(new InterceptableStore<any>()).toBeTruthy();
  });

  describe('addInterceptor() method', () => {
    it('should add item to default store and return self', () => {
      const store = new InterceptableStore<any>();

      expect(store.addInterceptor(5)).toBe(store);
      expect(store.getStore().length).toBe(1);
      expect(store.getStore()[0]).toBe(5);
    });
  });

  describe('removeInterceptor() method', () => {
    it('should remove item from default store and return self', () => {
      const store = new InterceptableStore<any>();
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.removeInterceptor(2)).toBe(store);
      expect(store.getStore()).toEqual([1, 3]);
    });

    it('should do nothing if item not found and return self', () => {
      const store = new InterceptableStore<any>();
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.removeInterceptor(4)).toBe(store);
      expect(store.getStore()).toEqual([1, 2, 3]);
    });
  });

  describe('clearInterceptors() method', () => {
    it('should clear default store and return self', () => {
      const store = new InterceptableStore<any>();
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.clearInterceptors()).toBe(store);
      expect(store.getStore()).toEqual([]);
    });

    it('should invoke removeInterceptor() for every item in arg and return self', () => {
      const store = new InterceptableStore<any>();
      spyOn(store, 'removeInterceptor').and.callThrough();
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.clearInterceptors([1, 3])).toBe(store);
      expect(store.removeInterceptor).toHaveBeenCalledTimes(2);
      expect(store.getStore()).toEqual([2]);
    });
  });

  describe('InterceptableStoreFactory', () => {
    describe('createStore() method', () => {
      it('should create new InterceptableStore', () => {
        const storeFactory = new InterceptableStoreFactory();
        const store = storeFactory.createStore<any>();
        expect(store).toEqual(jasmine.any(InterceptableStore));
      });
    });
  });
});

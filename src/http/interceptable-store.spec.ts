/* tslint:disable:no-unused-variable */

import { InterceptableStore, InterceptableStoreFactory } from './interceptable-store';

describe('InterceptableStore', () => {
  let mockStore: any[];

  beforeEach(() => mockStore = []);

  it('should create an instance', () => {
    expect(new InterceptableStore<any>(mockStore)).toBeTruthy();
  });

  describe('addInterceptor() method', () => {
    it('should add item to store and return self', () => {
      const store = new InterceptableStore<any>(mockStore);

      expect(store.addInterceptor(5)).toBe(store);
      expect(mockStore.length).toBe(1);
      expect(mockStore[0]).toBe(5);
    });
  });

  describe('removeInterceptor() method', () => {
    it('should remove item from store and return self', () => {
      mockStore = [1, 2, 3];
      const store = new InterceptableStore<any>(mockStore);

      expect(store.removeInterceptor(2)).toBe(store);
      expect(mockStore).toEqual([1, 3]);
    });

    it('should do nothing if item not found and return self', () => {
      mockStore = [1, 2, 3];
      const store = new InterceptableStore<any>(mockStore);

      expect(store.removeInterceptor(4)).toBe(store);
      expect(mockStore).toEqual([1, 2, 3]);
    });
  });

  describe('clearInterceptors() method', () => {
    it('should clear store and return self', () => {
      mockStore = [1, 2, 3];
      const store = new InterceptableStore<any>(mockStore);

      expect(store.clearInterceptors()).toBe(store);
      expect(mockStore).toEqual([]);
    });

    it('should invoke removeInterceptor() for every item in arg and return self', () => {
      mockStore = [1, 2, 3];
      const store = new InterceptableStore<any>(mockStore);
      spyOn(store, 'removeInterceptor').and.callThrough();

      expect(store.clearInterceptors([1, 3])).toBe(store);
      expect(store.removeInterceptor).toHaveBeenCalledTimes(2);
      expect(mockStore).toEqual([2]);
    });
  });

  describe('InterceptableStoreFactory', () => {
    describe('createStore() method', () => {
      it('should create new InterceptableStore with store provided', () => {
        const storeFactory = new InterceptableStoreFactory();
        const store = storeFactory.createStore<any>(mockStore);

        expect(store).toEqual(jasmine.any(InterceptableStore));

        store.addInterceptor(1);
        expect(mockStore).toEqual([1]);
      });
    });
  });
});

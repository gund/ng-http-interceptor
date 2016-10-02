import { InterceptableStore, InterceptableStoreFactory } from './interceptable-store';
import Spy = jasmine.Spy;

describe('InterceptableStore', () => {
  let store: InterceptableStore<any>;

  beforeEach(() => store = new InterceptableStore<any>());

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

  describe('addInterceptor() method', () => {
    it('should add item to default store and return self', () => {
      expect(store.addInterceptor(5)).toBe(store);
      expect(store.getStore().length).toBe(1);
      expect(store.getStore()[0]).toBe(5);
    });

    it('should add item to two different stores', () => {
      store.setActiveStore('store1').addInterceptor(1);
      store.setActiveStore('store2').addInterceptor(2);

      expect(store.getStore('store1')).toEqual([1]);
      expect(store.getStore('store2')).toEqual([2]);
      expect(store.getStore().length).toBe(0);
    });
  });

  describe('removeInterceptor() method', () => {
    it('should remove item from default store and return self', () => {
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.removeInterceptor(2)).toBe(store);
      expect(store.getStore()).toEqual([1, 3]);
    });

    it('should do nothing if item not found and return self', () => {
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.removeInterceptor(4)).toBe(store);
      expect(store.getStore()).toEqual([1, 2, 3]);
    });

    it('should remove item from two different stores', () => {
      store.setActiveStore('store1').addInterceptor(1).addInterceptor(2).addInterceptor(3);
      store.setActiveStore('store2').addInterceptor(4).addInterceptor(5).addInterceptor(6);

      expect(store.setActiveStore('store1').removeInterceptor(2)).toBe(store);
      expect(store.getStore('store1')).toEqual([1, 3]);

      expect(store.setActiveStore('store2').removeInterceptor(5)).toBe(store);
      expect(store.getStore('store2')).toEqual([4, 6]);
    });
  });

  describe('clearInterceptors() method', () => {
    it('should clear default store and return self', () => {
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.clearInterceptors()).toBe(store);
      expect(store.getStore()).toEqual([]);
    });

    it('should invoke removeInterceptor() for every item in arg and return self', () => {
      spyOn(store, 'removeInterceptor').and.callThrough();
      store.getStore().push(1);
      store.getStore().push(2);
      store.getStore().push(3);

      expect(store.clearInterceptors([1, 3])).toBe(store);
      expect(store.removeInterceptor).toHaveBeenCalledTimes(2);
      expect(store.getStore()).toEqual([2]);
    });

    it('should clear two different stores', () => {
      store.setActiveStore('store1').addInterceptor(1).addInterceptor(2).addInterceptor(3);
      store.setActiveStore('store2').addInterceptor(4).addInterceptor(5).addInterceptor(6);

      expect(store.setActiveStore('store1').clearInterceptors()).toBe(store);
      expect(store.getStore('store1')).toEqual([]);
      expect(store.getStore('store2')).toEqual([4, 5, 6]); // Still exists

      expect(store.setActiveStore('store2').clearInterceptors()).toBe(store);
      expect(store.getStore('store2')).toEqual([]);
    });

    it('should invoke removeInterceptor() for every item in arg for active store', () => {
      spyOn(store, 'removeInterceptor').and.callThrough();
      store.setActiveStore('store1').addInterceptor(1).addInterceptor(2).addInterceptor(3);
      store.setActiveStore('store2').addInterceptor(4).addInterceptor(5).addInterceptor(6);

      expect(store.setActiveStore('store1').clearInterceptors([1, 3])).toBe(store);
      expect(store.removeInterceptor).toHaveBeenCalledTimes(2);
      expect(store.getStore('store1')).toEqual([2]);
      expect(store.getStore('store2')).toEqual([4, 5, 6]); // Still exists

      (<Spy>store.removeInterceptor).calls.reset();
      expect(store.setActiveStore('store2').clearInterceptors([4, 6])).toBe(store);
      expect(store.removeInterceptor).toHaveBeenCalledTimes(2);
      expect(store.getStore('store2')).toEqual([5]);
    });
  });

  describe('setActiveStore() method', () => {
    it('should set `activeStore` from arg and return self', () => {
      expect(store.setActiveStore('key1')).toBe(store);
      store.addInterceptor(1);
      expect(store.getStore('key1')).toEqual([1]);
      expect(store.getStore()).toEqual([]);
    });

    it('should set `activeStore` by default to `/` and return self', () => {
      store.setActiveStore('key1').addInterceptor(1);
      expect(store.setActiveStore()).toBe(store);
      store.addInterceptor(2);

      expect(store.getStore('key1')).toEqual([1]);
      expect(store.getStore()).toEqual([2]);
    });
  });

  describe('getStore() method', () => {
    it('should return new store by key', () => {
      expect(store.getStore('key')).toEqual([]);
    });

    it('should return by default store with key `/`', () => {
      store.setActiveStore('/').addInterceptor(1);
      expect(store.getStore()).toEqual([1]);
    });

    it('should return already created store by same key', () => {
      expect(store.getStore('key')).toEqual([]);
      store.setActiveStore('key').addInterceptor(1);
      expect(store.getStore('key')).toEqual([1]);
    });
  });

  describe('getMatchedStores() method', () => {
    beforeEach(() => {
      store.addInterceptor(1);
      store.setActiveStore('/key1').addInterceptor(2);
      store.setActiveStore('/key2/val1').addInterceptor(3);
      store.setActiveStore(/\/key\d+\/?.*/).addInterceptor(4);
      store.setActiveStore(/\/no-match/).addInterceptor(5);
      store.setActiveStore(/\/(will-match)?$/).addInterceptor(6);
    });

    it('should return by default all stores matched by `/` merged', () => {
      expect(store.getMatchedStores()).toEqual([1, 6]);
    });

    it('should return stores matched by key merged', () => {
      expect(store.getMatchedStores('/key2')).toEqual([1, 4]);
      expect(store.getMatchedStores('/key2/val1')).toEqual([1, 3, 4]);
      expect(store.getMatchedStores('/key1')).toEqual([1, 2, 4]);
      expect(store.getMatchedStores('/will-match')).toEqual([1, 6]);
    });
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

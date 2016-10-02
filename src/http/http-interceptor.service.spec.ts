/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { HttpInterceptorService } from './http-interceptor.service';
import { InterceptableStoreFactory, DEFAULT_URL_STORE } from './interceptable-store';
import Spy = jasmine.Spy;

describe('Service: HttpInterceptor', () => {
  type InterceptableStoreMock = {
    setActiveStore: jasmine.Spy;
    getMatchedStores: jasmine.Spy;
    __isMock: boolean;
  }
  type InterceptableStoreMockFn = (...a) => InterceptableStoreMock;

  class InterceptableStoreFactoryMock extends InterceptableStoreFactory {
    static stores: InterceptableStoreMock[] = [];

    createStore(): any {
      const s: InterceptableStoreMock = {setActiveStore: null, getMatchedStores: null, __isMock: true};

      s.setActiveStore = jasmine.createSpy('setActiveStore').and.returnValue(s);
      s.getMatchedStores = jasmine.createSpy('getMatchedStores');

      InterceptableStoreFactoryMock.stores.push(s);
      return s;
    }
  }

  let service: {request: InterceptableStoreMockFn, response: InterceptableStoreMockFn} & HttpInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: InterceptableStoreFactory, useClass: InterceptableStoreFactoryMock},
        HttpInterceptorService
      ]
    });
  });

  beforeEach(inject([HttpInterceptorService], s => service = s));
  afterEach(() => InterceptableStoreFactoryMock.stores.splice(0)); // Cleanup created stores

  it('should exist', () => expect(service).toBeTruthy());

  it('should create 2 stores', () => {
    expect(InterceptableStoreFactoryMock.stores.length).toBe(2);
    expect(InterceptableStoreFactoryMock.stores[0].__isMock).toBeTruthy();
    expect(InterceptableStoreFactoryMock.stores[1].__isMock).toBeTruthy();
  });

  describe('request() method', () => {
    it('should return `Interceptable` instance', () => {
      expect(service.request()).toEqual(jasmine.objectContaining({__isMock: true}));
    });

    it('should call setActiveStore() with default url', () => {
      const store = service.request();
      expect(store.setActiveStore).toHaveBeenCalledWith(DEFAULT_URL_STORE);
    });

    it('should call setActiveStore() with provided string', () => {
      const store = service.request('/url');
      expect(store.setActiveStore).toHaveBeenCalledWith('/url');
    });

    it('should call setActiveStore() with provided RegExp', () => {
      const store = service.request(/\/my-url/);
      expect(store.setActiveStore).toHaveBeenCalledWith(/\/my-url/);
    });
  });

  describe('response() method', () => {
    it('should return `Interceptable` instance', () => {
      expect(service.response()).toEqual(jasmine.objectContaining({__isMock: true}));
    });

    it('should call setActiveStore() with default url', () => {
      const store = service.response();
      expect(store.setActiveStore).toHaveBeenCalledWith(DEFAULT_URL_STORE);
    });

    it('should call setActiveStore() with provided string', () => {
      const store = service.response('/url');
      expect(store.setActiveStore).toHaveBeenCalledWith('/url');
    });

    it('should call setActiveStore() with provided RegExp', () => {
      const store = service.response(/\/my-url/);
      expect(store.setActiveStore).toHaveBeenCalledWith(/\/my-url/);
    });
  });

  describe('_interceptRequest() method', () => {
    it('should reduce on request interceptors, invoke each and return result', () => {
      const store = InterceptableStoreFactoryMock.stores[0];
      const fn1 = jasmine.createSpy('fn1').and.returnValue(['/url1']);
      const fn2 = jasmine.createSpy('fn2').and.returnValue(['/url2']);
      const fn3 = jasmine.createSpy('fn3').and.returnValue(['/url3']);
      const method = 'method';

      store.getMatchedStores.and.returnValue([fn1, fn2, fn3]);

      const res = service._interceptRequest(method, ['/url']);

      expect(store.getMatchedStores).toHaveBeenCalledWith('/url');
      expect(fn1).toHaveBeenCalledWith(['/url'], method);
      expect(fn2).toHaveBeenCalledWith(['/url1'], method);
      expect(fn3).toHaveBeenCalledWith(['/url2'], method);
      expect(res).toEqual(['/url3']);
    });

    it('should reduce on request interceptors, invoke each until `false` returned and return it', () => {
      const store = InterceptableStoreFactoryMock.stores[0];
      const fn1 = jasmine.createSpy('fn1').and.returnValue(['/url1']);
      const fn2 = jasmine.createSpy('fn2').and.returnValue(false);
      const fn3 = jasmine.createSpy('fn3').and.returnValue(['/url3']);
      const method = 'method';

      store.getMatchedStores.and.returnValue([fn1, fn2, fn3]);

      const res = service._interceptRequest(method, ['/url']);

      expect(store.getMatchedStores).toHaveBeenCalledWith('/url');
      expect(fn1).toHaveBeenCalledWith(['/url'], method);
      expect(fn2).toHaveBeenCalledWith(['/url1'], method);
      expect(fn3).not.toHaveBeenCalled();
      expect(res).toBeFalsy();
    });
  });

  describe('_interceptResponse() method', () => {
    let observableMock: {flatMap: Spy};

    beforeEach(() => {
      observableMock = <any>{}; // Init

      observableMock.flatMap = jasmine.createSpy('Observable.flatMap')
        .and.returnValue(observableMock)
        .and.callFake(fn => fn()); // Invoke callbacks synchronously
    });

    it('should reduce on response interceptors, invoke flatMap() on each and return result', () => {
      const store = InterceptableStoreFactoryMock.stores[1];
      const fn1 = jasmine.createSpy('fn1').and.returnValue(observableMock);
      const fn2 = jasmine.createSpy('fn2').and.returnValue(observableMock);
      const fn3 = jasmine.createSpy('fn3').and.returnValue(observableMock);
      const method = 'method';

      store.getMatchedStores.and.returnValue([fn1, fn2, fn3]);

      const res = service._interceptResponse('/url', method, <any>observableMock);

      expect(store.getMatchedStores).toHaveBeenCalledWith('/url');
      expect(fn1).toHaveBeenCalledWith(observableMock, method);
      expect(fn2).toHaveBeenCalledWith(observableMock, method);
      expect(fn3).toHaveBeenCalledWith(observableMock, method);
      expect(res).toBe(observableMock);
    });
  });
});

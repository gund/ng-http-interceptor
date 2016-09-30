/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { HttpInterceptorService } from './http-interceptor.service';
import { InterceptableStoreFactory } from './interceptable-store';

describe('Service: HttpInterceptor', () => {
  class InterceptableStoreMock {
    constructor(public store: any[]) {
    }
  }

  class InterceptableStoreFactoryMock extends InterceptableStoreFactory {
    static stores: InterceptableStoreMock[] = [];

    createStore(store): any {
      const s = new InterceptableStoreMock(store);
      InterceptableStoreFactoryMock.stores.push(s);
      return s;
    }
  }

  let service: HttpInterceptorService;

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
    expect(InterceptableStoreFactoryMock.stores[0]).toEqual(jasmine.any(InterceptableStoreMock));
    expect(InterceptableStoreFactoryMock.stores[1]).toEqual(jasmine.any(InterceptableStoreMock));
  });

  describe('request() method', () => {
    it('should return `Interceptable` instance', () =>
      expect(service.request()).toEqual(jasmine.any(InterceptableStoreMock)));
  });

  describe('response() method', () => {
    it('should return `Interceptable` instance', () =>
      expect(service.response()).toEqual(jasmine.any(InterceptableStoreMock)));
  });

  describe('_interceptRequest() method', () => {
    it('should reduce on request interceptors, invoke each and return result', () => {
      const fn1 = jasmine.createSpy('fn1').and.returnValue(2);
      const fn2 = jasmine.createSpy('fn2').and.returnValue(3);
      const fn3 = jasmine.createSpy('fn3').and.returnValue(4);
      const method = 'method';

      InterceptableStoreFactoryMock.stores[0].store.push(fn1);
      InterceptableStoreFactoryMock.stores[0].store.push(fn2);
      InterceptableStoreFactoryMock.stores[0].store.push(fn3);

      const res = service._interceptRequest(method, <any>1);

      expect(fn1).toHaveBeenCalledWith(1, method);
      expect(fn2).toHaveBeenCalledWith(2, method);
      expect(fn3).toHaveBeenCalledWith(3, method);
      expect(res).toBe(4);
    });

    it('should reduce on request interceptors, invoke each until `false` returned and return it', () => {
      const fn1 = jasmine.createSpy('fn1').and.returnValue(2);
      const fn2 = jasmine.createSpy('fn2').and.returnValue(false);
      const fn3 = jasmine.createSpy('fn3').and.returnValue(4);
      const method = 'method';

      InterceptableStoreFactoryMock.stores[0].store.push(fn1);
      InterceptableStoreFactoryMock.stores[0].store.push(fn2);
      InterceptableStoreFactoryMock.stores[0].store.push(fn3);

      const res = service._interceptRequest(method, <any>1);

      expect(fn1).toHaveBeenCalledWith(1, method);
      expect(fn2).toHaveBeenCalledWith(2, method);
      expect(fn3).not.toHaveBeenCalled();
      expect(res).toBe(false);
    });
  });

  describe('_interceptResponse() method', () => {
    it('should reduce on response interceptors, invoke flatMap() on each and return result', () => {
      const observableMock = {flatMap: null};
      observableMock.flatMap = jasmine.createSpy('Observable.flatMap')
        .and.returnValue(observableMock)
        .and.callFake(fn => fn()); // Invoke callbacks synchronously

      const fn1 = jasmine.createSpy('fn1').and.returnValue(observableMock);
      const fn2 = jasmine.createSpy('fn2').and.returnValue(observableMock);
      const fn3 = jasmine.createSpy('fn3').and.returnValue(observableMock);
      const method = 'method';

      InterceptableStoreFactoryMock.stores[1].store.push(fn1);
      InterceptableStoreFactoryMock.stores[1].store.push(fn2);
      InterceptableStoreFactoryMock.stores[1].store.push(fn3);

      const res = service._interceptResponse(method, <any>observableMock);

      expect(observableMock.flatMap).toHaveBeenCalledTimes(3);
      expect(fn1).toHaveBeenCalledWith(observableMock, method);
      expect(fn2).toHaveBeenCalledWith(observableMock, method);
      expect(fn3).toHaveBeenCalledWith(observableMock, method);
      expect(res).toBe(observableMock);
    });
  });
});

import { Injectable } from '@angular/core';
import { Interceptable, Interceptor } from './interceptable';

type AnyInterceptor = Interceptor<any, any>;

@Injectable()
export class InterceptableStoreFactory {

  // noinspection JSMethodCanBeStatic
  createStore<D extends AnyInterceptor>(store: D[]) {
    return new InterceptableStore<D>(store);
  }

}

export class InterceptableStore<T extends AnyInterceptor> implements Interceptable<T> {

  constructor(private store: T[] = []) {
  }

  addInterceptor(interceptor: T): Interceptable<T> {
    this.store.push(interceptor);
    return this;
  }

  removeInterceptor(interceptor: T): Interceptable<T> {
    const idx = this.store.indexOf(interceptor);

    if (idx === -1) {
      return this;
    }

    this.store.splice(idx, 1);
    return this;
  }

  clearInterceptors(interceptors: T[] = []): Interceptable<T> {
    if (interceptors.length > 0) {
      interceptors.forEach(i => this.removeInterceptor(i));
    } else {
      this.store.splice(0);
    }

    return this;
  }

}

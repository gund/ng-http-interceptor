import { Injectable } from '@angular/core';
import { Interceptable, Interceptor } from './interceptable';

export type AnyInterceptor = Interceptor<any, any>;

@Injectable()
export class InterceptableStoreFactory {

  // noinspection JSMethodCanBeStatic
  createStore<D extends AnyInterceptor>() {
    return new InterceptableStore<D>();
  }

}

export const DEFAULT_URL_STORE = '/';

export class InterceptableStore<T extends AnyInterceptor> implements Interceptable<T> {

  private storeMatcher: {[url: string]: RegExp} = {};
  private stores: {[url: string]: T[]} = {};
  private activeStore: string = DEFAULT_URL_STORE;

  private get store(): T[] {
    return this._getStoreSafely(this.activeStore);
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

  // ----------
  // Internal API

  setActiveStore(url = DEFAULT_URL_STORE): InterceptableStore<T> {
    this.activeStore = url;
    this.storeMatcher[url] = new RegExp(url);
    return this;
  }

  getStore(key = DEFAULT_URL_STORE): T[] {
    return this._getStoreSafely(key);
  }

  getMatchedStores(url = DEFAULT_URL_STORE): T[] {
    const backedUrl = `/${url.replace('/', '\\/')}/`;
    return Object.keys(this.stores)
      .filter(k => k === url || k === backedUrl || this.storeMatcher[k].test(url))
      .map(k => this.getStore(k))
      .reduce((stores, store) => [...stores, ...store], []);
  }

  private _getStoreSafely(key: string): T[] {
    return (this.stores[key] || (this.stores[key] = []));
  }

}

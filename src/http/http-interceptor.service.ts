import { Injectable } from '@angular/core';
import { HttpInterceptor, RequestInterceptor, ResponseInterceptor } from './http-interceptor';
import { Interceptable } from './interceptable';
import { InterceptableStoreFactory, DEFAULT_URL_STORE } from './interceptable-store';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  private _requestStore = this.store.createStore<RequestInterceptor>();
  private _responseStore = this.store.createStore<ResponseInterceptor>();

  constructor(private store: InterceptableStoreFactory) {
  }

  request(url: string|RegExp = DEFAULT_URL_STORE): Interceptable<RequestInterceptor> {
    return this._requestStore.setActiveStore(url);
  }

  response(url: string|RegExp = DEFAULT_URL_STORE): Interceptable<ResponseInterceptor> {
    return this._responseStore.setActiveStore(url);
  }

  _interceptRequest(url: string, method: string, data: any[]): any[] {
    return this._requestStore.getMatchedStores(url).reduce((d, i) => {
      if (!d) {
        return d;
      }

      return i(d, method);
    }, data);
  }

  _interceptResponse(url: string, method: string, response: Observable<Response>): Observable<Response> {
    return this._responseStore.getMatchedStores(url).reduce((o, i) => i(o, method), response);
  }

}

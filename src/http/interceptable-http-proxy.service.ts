import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { HttpInterceptorService } from './http-interceptor.service';
import { Observable } from 'rxjs';
import { identityFactory } from './util';

@Injectable()
export class InterceptableHttpProxyService implements ProxyHandler<any> {

  private static _callStack: string[] = [];

  constructor(private http: Http, private httpInterceptorService: HttpInterceptorService) {
  }

  get(target: any, p: PropertyKey, receiver: any): any {
    InterceptableHttpProxyService._callStack.push(<string>p);
    return receiver;
  }

  apply(target: any, thisArg: any, argArray?: any): any {
    const method = InterceptableHttpProxyService._callStack.pop();
    const args = this.httpInterceptorService._interceptRequest(method, argArray);

    // Check for request cancellation
    if (!args) {
      return Observable.empty();
    }

    const response = this.http[method].apply(this.http, args);

    return this.httpInterceptorService._interceptResponse(method, response);
  }
}

export const InterceptableHttpProxyProviders = [
  {
    provide: Http,
    useFactory: (backend, options, interceptor) =>
      new Proxy(() => null, new InterceptableHttpProxyService(new Http(backend, options), interceptor)),
    deps: [XHRBackend, RequestOptions, HttpInterceptorService]
  },
  identityFactory(InterceptableHttpProxyService, Http)
];

export const InterceptableHttpProxyNoOverrideProviders = [
  {
    provide: InterceptableHttpProxyService,
    useFactory: (http, interceptor) =>
      new Proxy(() => null, new InterceptableHttpProxyService(http, interceptor)),
    deps: [Http, HttpInterceptorService]
  }
];

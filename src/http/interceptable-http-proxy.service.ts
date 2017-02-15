import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptorService } from './http-interceptor.service';
import { identityFactory, safeProxy } from './util';

@Injectable()
export class InterceptableHttpProxyService implements ProxyHandler<any> {

  private static _callStack: string[] = [];

  private static _extractUrl(url: any[]): string {
    const dirtyUrl: string & { url: string } = url[0];
    return typeof dirtyUrl === 'object' && 'url' in dirtyUrl ? dirtyUrl.url : dirtyUrl;
  }

  constructor(private http: Http, private httpInterceptorService: HttpInterceptorService) {
  }

  get(target: any, p: PropertyKey, receiver: any): any {
    InterceptableHttpProxyService._callStack.push(<string>p);
    return receiver;
  }

  apply(target: any, thisArg: any, argArray?: any): any {
    const method = InterceptableHttpProxyService._callStack.pop();

    // create a object without prototype as the context object
    const context = Object.create(null);

    return this.httpInterceptorService
      ._interceptRequest(InterceptableHttpProxyService._extractUrl(argArray), method, argArray, context)
      .switchMap(args => {
        // Check for request cancellation
        if (!args) {
          return Observable.empty();
        }

        const response = this.http[method].apply(this.http, args);

        return this.httpInterceptorService._interceptResponse(
          InterceptableHttpProxyService._extractUrl(args), method, response, context);
      });
  }

}

export const _proxyTarget = () => null;

// Make sure all Http methods are known for Proxy Polyfill
Object.keys(Http.prototype).forEach(method => _proxyTarget[method] = `Http.${method}`);

export function _proxyFactory(http, interceptor) {
  return safeProxy(_proxyTarget, new InterceptableHttpProxyService(http, interceptor));
}

export function proxyFactory(backend, options, interceptor) {
  return _proxyFactory(new Http(backend, options), interceptor);
}

export const InterceptableHttpProxyProviders = [
  {
    provide: Http,
    useFactory: proxyFactory,
    deps: [XHRBackend, RequestOptions, HttpInterceptorService]
  },
  identityFactory(InterceptableHttpProxyService, Http),
];

export const InterceptableHttpProxyNoOverrideProviders = [
  {
    provide: InterceptableHttpProxyService,
    useFactory: _proxyFactory,
    deps: [Http, HttpInterceptorService]
  }
];

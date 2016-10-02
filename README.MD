# ng2-http-interceptor

[![Build Status][travis-badge]][travis-badge-url]
[![Coverage Status][codecov-badge]][codecov-badge-url]
[![Npm][npm-badge]][npm-badge-url]

> Http Interceptor library for Angular 2

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Documentation](#documentation)
* [Development](#development)

## Installation

To install this library, run:

```bash
$ npm install ng2-http-interceptor --save
```

## Usage

To use it you must first declare providers in your `@NgModule`.  
You have 2 options:  
1. Register `InterceptableHttp` AND override original `Http` service so
that all your requests will be intercepted  
2. Register ONLY `InterceptableHttp` and keep original `Http` service so
you can make requests which are intercepted and not.
  
For case #1 use:
```ts
{
    providers: [...HTTP_INTERCEPTOR_PROVIDER]
}
```

For case #2 use:
```ts
{
    providers: [...HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER]
}
```

After registering you can use `InterceptableHttp` for your requests
and `Http` if you chose to override it (case #1):
```ts
constructor(private http: Http, httpInterceptor: HttpInterceptorService) {
    httpInterceptor.request().addInterceptor((data, method) => {
      console.log(method, data);
      return data;
    });

    httpInterceptor.response().addInterceptor((res, method) => {
      res.subscribe(r => console.log(method, r));
      return res;
    });
    
    this.http.get('/')
          .map(r => r.text())
          .subscribe(console.log);
}
```

In this setup every request and response will be logged to the console.  
You can also cancel request by returning `false` value (that coerce to boolean false)
from one of registered _request_ interceptors.  

You can find in-depth explanation of internal concepts here: https://goo.gl/GU9VWo  
Also if you want to play with it check this [repo](https://github.com/gund/angular2-http-interceptor-test).

## Documentation

All and every interception setup is made by `HttpInterceptorService` service.  
Inject this service in place where you want to manage interceptors.
  
### Public API

**HttpInterceptorService**
```ts
HttpInterceptorService: {
    request(url?: string|RegExp): Interceptable,
    response(url?: string|RegExp): Interceptable
}
```

<sub>See [src/http/http-interceptor.ts](./src/http/http-interceptor.ts#L8) for full reference</sub>

_Description_: Methods will determine when to call interceptor - before
request (`request()`) or after response (`response()`).  
You can also specify url filtering (`string|RegExp`) which will indicate
when interceptor must be triggered depending on url.  
By default all interceptors fall under `'/'` url key which means every
interceptor registered that way will be triggered despite of actual url.

**Interceptable**
```ts
Interceptable: {
    addInterceptor(interceptorFn: Interceptor): Interceptable,
    removeInterceptor(interceptorFn: Interceptor): Interceptable,
    clearInterceptors(interceptorFns?: Interceptor[]): Interceptable
}
```

<sub>See [src/http/interceptable.ts](./src/http/interceptable.ts#L1) for full reference</sub>

_Description_: This object will help you manage interceptors with
respect to your selected configuration (url filtering).

**Interceptor**
```ts
export interface Interceptor {
  (data: any, method: string): any;
}
```

<sub>See [src/http/interceptable.ts](./src/http/interceptable.ts#L7) for full reference</sub>

_Description_: This is generic type of interceptor - which is a plain old JavaScript function.  
You will be dealing with specific one to satisfy it's criteria:
* `Interceptor<any[], any[]>` - for **request** interceptors
    Function will get an array of parameters with which call on `Http`
    was made + method name as string (`get`, `post`, `delete`...)
    and should return array of the same structure or `false` to cancel request.
* `Interceptor<Observable<Response>, Observable<Response>>` - for **response** interceptors
    Function will get Observable + method name as string (`get`, `post`, `delete`...)
    and should return same or new Observable but with type Response
    (this is made specifically to prevent other code being broken
    because response was intercepted and structure changed)

## Development

To generate all `*.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To run unit tests:

```bash
$ npm test
```

## License

MIT © [Alex Malkevich](malkevich.alex@gmail.com)


[travis-badge]: https://travis-ci.org/gund/ng2-http-interceptor.svg?branch=master
[travis-badge-url]: https://travis-ci.org/gund/ng2-http-interceptor
[codecov-badge]: https://codecov.io/gh/gund/ng2-http-interceptor/branch/master/graph/badge.svg
[codecov-badge-url]: https://codecov.io/gh/gund/ng2-http-interceptor
[npm-badge]: https://badge.fury.io/js/ng2-http-interceptor.svg
[npm-badge-url]: https://badge.fury.io/js/ng2-http-interceptor

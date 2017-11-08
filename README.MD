# ng-http-interceptor

> Http Interceptor library for Angular

*Previously was called `ng2-http-interceptor`*

[![Travis CI](https://img.shields.io/travis/gund/ng-http-interceptor/master.svg?maxAge=2592000)](https://travis-ci.org/gund/ng-http-interceptor)
[![Coverage](https://img.shields.io/codecov/c/github/gund/ng-http-interceptor.svg?maxAge=2592000)](https://codecov.io/gh/gund/ng-http-interceptor)
[![Code Climate](https://img.shields.io/codeclimate/github/gund/ng-http-interceptor.svg?maxAge=2592000)](https://codeclimate.com/github/gund/ng-http-interceptor)
[![Npm](https://img.shields.io/npm/v/ng-http-interceptor.svg?maxAge=2592000)](https://badge.fury.io/js/ng-http-interceptor)
[![Npm Downloads](https://img.shields.io/npm/dt/ng2-http-interceptor.svg?maxAge=2592000)](https://www.npmjs.com/package/ng-http-interceptor)
[![Licence](https://img.shields.io/npm/l/ng-http-interceptor.svg?maxAge=2592000)](https://github.com/gund/ng-http-interceptor/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Version 4.x.x supports Angular 5 (`ng-http-interceptor@^4.0.0`)

Version 3.x.x supports Angular 4 (`ng-http-interceptor@^3.0.0`)

Version 2.x.x supports Angular 2 (`ng-http-interceptor@^2.0.0`)

## Features

* Registering interceptors globally
* Separate interceptors for requests and responses
* Attach interceptors for specific urls via strings or RegExp's
* Remove specific/all interceptor(s)
* Modify requests (even url) from request interceptors
* Cancel requests from request interceptors
* Modify responses from response interceptors
* Interceptor Service is not coupled with Http Service
* Choose between overriding original Http Service or keep it and still use interceptors
* Comprehensive type assistance for your interceptor functions
* Supports AOT compilation with shipped _*.metadata.json_ files
* UMD builds in _dist/bundles_ folder ready to use in Browsers
* Simple http data extraction and manipulation with [Helpers Functions](#helpers-functions-since-v130)
* Sharing context object between all interceptors

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
* [Documentation](#documentation)
* [Development](#development)

## Prerequisites

This library uses `Proxy` from ES6 spec so if you need to support browsers
that are ES5 compatible include [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill).

Library uses `tslib` (standard Typescript runtime library) so please make sure
you have this module installed via `npm`.

## Installation

To install this library, run:

```bash
$ npm install ng-http-interceptor --save
```

## Usage

#### Case #1

Import `HttpInterceptorModule` to your application module.
This will override original `Http` Service and all requests will be intercepted.

#### Case #2

Import as `HttpInterceptorModule.noOverrideHttp()` to keep original `Http` Service
and use `InterceptableHttp` for requests to be intercepted.

### Example use-case

You can use `InterceptableHttp` for your requests in case #1 and #2
and `Http` if you chose to override it (case #1 only):
```ts
constructor(http: Http, httpInterceptor: HttpInterceptorService) {
    httpInterceptor.request().addInterceptor((data, method) => {
      console.log(method, data);
      return data;
    });

    httpInterceptor.response().addInterceptor((res, method) => {
      return res.do(r => console.log(method, r));
    });

    this.http.get('/')
          .map(r => r.text())
          .subscribe(console.log);
}
```

In this setup every request and response will be logged to the console.
You can also cancel request by returning `false` value (that coerce to boolean false)
from one of registered _request_ interceptors.
You can return `Observable` from _request_ interceptors to do some async job.

You can find in-depth explanation of internal concepts here: https://goo.gl/GU9VWo
Also if you want to play with it check this [repo](https://github.com/gund/angular2-http-interceptor-test).
Or check this [plnkr demo](https://plnkr.co/edit/qTTdPl8EggQleTfTSbch).

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
Interceptor<T, D> {
  (data: T, method: string, ctx?: any): D;
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

#### Helpers Functions (since v1.3.0)

There are a bunch of helper functions added to simplify some common
work with _data_ array (for ex. getting `RequestOptions` or even `Headers`).

**getHttpHeadersOrInit()**
```ts
function getHttpHeadersOrInit(data: any[], method: string): Headers;
```

<sub>See [src/http/helpers/getHttpHeadersOrInit.ts](./src/http/helpers/getHttpHeadersOrInit.ts) for full reference</sub>

_Description_: Gets `Headers` from _data_ array.
If no `RequestOptions` found - creates it and updates original _data_ array.
If no `Headers` found - creates it and sets to `RequestOptions`.

Exmaple how to add custom headers to requests:
```ts
httpInterceptor.request().addInterceptor((data, method) => {
  const headers = getHttpHeadersOrInit(data, method);
  headers.set('X-Custom-Header', 'value');
  return data;
});
```

**getHttpOptionsAndIdx()**
```ts
function getHttpOptionsAndIdx(
    data: any[],
    method: string,
    alwaysOriginal?: boolean
): {
    options: RequestOptions;
    idx: number;
};
```

<sub>See [src/http/helpers/getHttpOptionsAndIdx.ts](./src/http/helpers/getHttpOptionsAndIdx.ts) for full reference</sub>

_Description_: Gets `RequestOptions` and it's index location in _data_ array.
If no options found and `alwaysOriginal = false` - creates new `RequestOptions`
but does NOT set it back on _data_ array.
* Param `alwaysOriginal` is `false` by default.

**getHttpOptions()**
```ts
function getHttpOptions(
    data: any[],
    method: string,
    alwaysOriginal?: boolean): RequestOptions;
```

<sub>See [src/http/helpers/getHttpOptions.ts](./src/http/helpers/getHttpOptions.ts) for full reference</sub>

_Description_: Gets http `RequestOptions` from data array.
If no options found and `alwaysOriginal = false` - returns new `RequestOptions`
but does NOT set it back on _data_ array.
* Param `alwaysOriginal` is `false` by default.

**getHttpOptionsIdx()**
```ts
function getHttpOptionsIdx(method: string): number;
```

<sub>See [src/http/helpers/getHttpOptionsIdx.ts](./src/http/helpers/getHttpOptionsIdx.ts) for full reference</sub>

_Description_: Gets index of `RequestOptions` in http data array for specified `method`.


## Development

To generate all `*.js`, `*.js.map`, `*.d.ts` and `*.metadata.json` files:

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

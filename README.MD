# ng2-http-interceptor [![Build Status](https://travis-ci.org/gund/ng2-http-interceptor.svg?branch=master)](https://travis-ci.org/gund/ng2-http-interceptor) [![Coverage Status](https://coveralls.io/repos/github/gund/ng2-http-interceptor/badge.svg?branch=master)](https://coveralls.io/github/gund/ng2-http-interceptor?branch=master)

> Http Interceptor library for Angular 2

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

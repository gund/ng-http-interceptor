/* tslint:disable:no-unused-variable */

// noinspection ES6UnusedImports
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { HttpInterceptorService } from './http-interceptor.service';
// noinspection ES6UnusedImports
import {
  InterceptableHttpProxyProviders,
  InterceptableHttpProxyNoOverrideProviders,
  InterceptableHttpProxyService
} from './interceptable-http-proxy.service';
import { InterceptableHttpProviders } from './interceptable-http';
import { InterceptableStoreFactory } from './interceptable-store';

const SharedProviders = [
  InterceptableStoreFactory,
  HttpInterceptorService,
  ...InterceptableHttpProviders
];

// noinspection JSUnusedGlobalSymbols
export const HTTP_INTERCEPTOR_PROVIDER = [
  ...SharedProviders,
  ...InterceptableHttpProxyProviders
];

// noinspection JSUnusedGlobalSymbols
export const HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER = [
  ...SharedProviders,
  ...InterceptableHttpProxyNoOverrideProviders
];

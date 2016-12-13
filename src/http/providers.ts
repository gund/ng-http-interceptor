import { Provider } from '@angular/core';
import { HttpInterceptorService } from './http-interceptor.service';
import {
  InterceptableHttpProxyProviders,
  InterceptableHttpProxyNoOverrideProviders
} from './interceptable-http-proxy.service';
import { InterceptableHttpProviders } from './interceptable-http';
import { InterceptableStoreFactory } from './interceptable-store';

const SharedProviders = [
  InterceptableStoreFactory,
  HttpInterceptorService,
  ...InterceptableHttpProviders
];

export const HTTP_INTERCEPTOR_PROVIDER: Provider[] = [
  ...SharedProviders,
  ...InterceptableHttpProxyProviders
];

export const HTTP_INTERCEPTOR_NO_OVERRIDE_PROVIDER: Provider[] = [
  ...SharedProviders,
  ...InterceptableHttpProxyNoOverrideProviders
];

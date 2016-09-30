import { Injectable } from '@angular/core';
import { Http, RequestOptions, ConnectionBackend } from '@angular/http';
import { InterceptableHttpProxyService } from './interceptable-http-proxy.service';
import { identityFactory } from './util';

@Injectable()
export class InterceptableHttp extends Http {

  constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions) {
    super(_backend, _defaultOptions);
  }

}

export const InterceptableHttpProviders = [
  identityFactory(InterceptableHttp, InterceptableHttpProxyService)
];

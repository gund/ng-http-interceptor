/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { InterceptableHttp } from './interceptable-http';
import { HttpModule, XHRBackend, Http, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

describe('Service: InterceptableHttp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        {provide: ConnectionBackend, useClass: MockBackend},
        InterceptableHttp
      ]
    });
  });

  it('should exist', inject([InterceptableHttp], (service: InterceptableHttp) => {
    expect(service).toBeTruthy();
  }));

  it('should extend Http service', inject([InterceptableHttp, Http], (service: InterceptableHttp, http: Http) => {
    expect(service).toEqual(jasmine.any(http.constructor));
  }));
});

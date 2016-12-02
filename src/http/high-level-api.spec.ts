import { TestBed, inject, async } from '@angular/core/testing';
import { HttpInterceptorService } from './http-interceptor.service';
import { XHRBackend, HttpModule, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { HTTP_INTERCEPTOR_PROVIDER } from './providers';
import { Observable } from 'rxjs';

declare let Zone;

describe('High-level API', () => {
  let httpInterceptor: HttpInterceptorService;
  let mockBackend: MockBackend;
  let http: Http;
  const interceptor = jasmine.createSpy('interceptor');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        ...HTTP_INTERCEPTOR_PROVIDER
      ]
    });
    interceptor.calls.reset();
  });

  beforeEach(inject(
    [HttpInterceptorService, XHRBackend, Http],
    (httpInterceptor_, mockBackend_, http_) => {
      httpInterceptor = httpInterceptor_;
      mockBackend = mockBackend_;
      http = http_;
    }));

  describe('request()', () => {
    beforeAll(() => interceptor.and.callFake(d => d));
    beforeEach(() => httpInterceptor.request().addInterceptor(interceptor));

    testHttpRequest('request');
    testHttpRequest('get');
    testHttpRequest('post', 'data');
    testHttpRequest('put', 'data');
    testHttpRequest('delete');
    testHttpRequest('patch', 'data');
    testHttpRequest('head');
    testHttpRequest('options');

    it('should send request to changed url and with changed data from interceptor', () => {
      const connValidator = jasmine.createSpy('connValidator').and
        .callFake(conn => {
          expect(conn.request.url).toBe('/changed-url');
          expect(conn.request.getBody()).toBe('changed-data');
        });

      interceptor.and.returnValue(['/changed-url', 'changed-data']);
      mockBackend.connections.subscribe(connValidator);

      http.post('/url', 'data').subscribe(() => null);

      expect(connValidator).toHaveBeenCalled();
    });

    it('should not send request when interceptor returned `false`', async(() => {
      const callback = jasmine.createSpy('callback');
      interceptor.and.returnValue(false);

      mockBackend.connections.subscribe(conn => {
        throw Error(`Request was made to \`${conn.request.url}\``);
      });

      http.get('/').subscribe(callback);

      expect(callback).not.toHaveBeenCalled();
    }));

    it('should be able to share data between interceptors', async(() => {
      interceptor.and.callFake(d => {
        Zone.current.get('context')['testkey'] = 'test';
        return d;
      });
      const interceptor1 = jasmine.createSpy('interceptor1');
      interceptor1.and.callFake(d => {
        expect(Zone.current.get('context')['testkey']).toBe('test');
        return d;
      });
      httpInterceptor.request().addInterceptor(interceptor1);
      http.post('/url', 'data').subscribe(() => null);
    }));
  });

  describe('response()', () => {
    beforeAll(() => interceptor.and.callFake(o => o.map(() => 'changed')));
    beforeEach(() => httpInterceptor.response().addInterceptor(interceptor));

    it('should intercept response', () => {
      const callback = jasmine.createSpy('callback');
      const connCallback = jasmine.createSpy('connCallback').and
        .callFake(conn => conn.mockRespond(responseBody('mocked')));

      mockBackend.connections.subscribe(connCallback);

      interceptor.and.callFake(o => {
        o.subscribe(() => null);
        return o.map(() => 'changed');
      });

      http.get('/url').subscribe(callback);

      expect(interceptor).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith('changed');
      expect(connCallback).toHaveBeenCalledTimes(1);
    });

    it('should intercept response on HTTP error', () => {
      interceptor.and.callFake(() => Observable.of('fixed error'));
      const errorCallback = jasmine.createSpy('errorCallback').and.returnValue(Observable.empty());
      const callback = jasmine.createSpy('callback');
      mockBackend.connections.subscribe(conn => conn.mockError(Error('error')));

      http.get('/url').catch(errorCallback).subscribe(callback);

      expect(interceptor).toHaveBeenCalled();
      expect(errorCallback).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith('fixed error');
    });
  });

  // -----------
  // Helpers

  function testHttpRequest(method, data?, url = '/url') {
    it(`should intercept \`${method}\` request`, async(() => {
      const callback = jasmine.createSpy('callback').and
        .callFake(r => expect(r.text()).toBe('mocked')); // Make sure response arrived

      const connCallback = jasmine.createSpy('connCallback').and
        .callFake(conn => {
          expect(conn.request.url).toBe(url); // Make sure request valid
          conn.mockRespond(responseBody('mocked')); // Mock response
        });

      mockBackend.connections.subscribe(connCallback);

      http[method](url, data).subscribe(callback); // Request

      expect(interceptor).toHaveBeenCalledWith([url, data], method); // Interceptor called?
      expect(callback).toHaveBeenCalled(); // Response callback called?
      expect(connCallback).toHaveBeenCalledTimes(1); // Only one request?
    }));
  }

  function responseBody(body, status = 200) {
    return new Response(new ResponseOptions({body, status}));
  }

});

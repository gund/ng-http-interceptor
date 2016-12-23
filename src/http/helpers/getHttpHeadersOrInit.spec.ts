import { Headers } from '@angular/http';
import * as module from './getHttpOptionsAndIdx';
import { getHttpHeadersOrInit } from './getHttpHeadersOrInit';

describe('getHttpHeadersOrInit() function', () => {
  let getHttpOptionsAndIdxSpy: jasmine.Spy;

  beforeEach(() => getHttpOptionsAndIdxSpy = spyOn(module, 'getHttpOptionsAndIdx'));

  it('should call getHttpOptionsAndIdx() with `data` and `method` args', () => {
    getHttpHeadersOrInitTry([1], 'method');
    expect(getHttpOptionsAndIdxSpy).toHaveBeenCalledWith([1], 'method');
  });

  it('should return `Headers` from `options` and set them back', () => {
    getHttpOptionsAndIdxSpy.and.returnValue({
      options: { headers: 'headers' },
      idx: 1
    });

    const data = [0, 1];
    const res = getHttpHeadersOrInit(data, 'method');

    expect(res).toBe('headers');
    expect(data).toEqual([0, { headers: 'headers' }]);
  });

  it('should create `Headers` if not found in `options`, return it and set back', () => {
    getHttpOptionsAndIdxSpy.and.returnValue({
      options: {},
      idx: 1
    });

    const data = [0, 1];
    const res = getHttpHeadersOrInit(data, 'method');

    expect(res).toEqual(jasmine.any(Headers));
    expect(data).toEqual([0, { headers: jasmine.any(Headers) }]);
  });

});

function getHttpHeadersOrInitTry(data: any[], method: string) {
  try {
    return getHttpHeadersOrInit(data, method);
  } catch (_) { }
}

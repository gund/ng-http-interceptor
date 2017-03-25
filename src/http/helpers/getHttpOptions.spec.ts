import { RequestOptions } from '@angular/http';
import * as module from './getHttpOptionsIdx';
import { getHttpOptions } from './getHttpOptions';

describe('getHttpOptions() function', () => {
  let getHttpOptionsIdxSpy: jasmine.Spy;

  beforeEach(() => getHttpOptionsIdxSpy = spyOn(module, 'getHttpOptionsIdx'));

  it('should call getHttpOptionsIdx() with `method` arg', () => {
    getHttpOptions([], 'method');
    expect(getHttpOptionsIdxSpy).toHaveBeenCalledWith('method');
  });

  it('should return value from `data` by index returned from getHttpOptionsIdx()', () => {
    getHttpOptionsIdxSpy.and.returnValue(2);
    expect(getHttpOptions([1, 2, 3], 'method')).toBe(3 as any);
  });

  it('should return `new RequestOptions` if no value at the index found by default', () => {
    getHttpOptionsIdxSpy.and.returnValue(1);
    expect(getHttpOptions([1], 'method')).toEqual(jasmine.any(RequestOptions));
  });

  it('should always return original value if `alwaysOriginal` set to `true`', () => {
    getHttpOptionsIdxSpy.and.returnValue(1);
    expect(getHttpOptions([1], 'method', true)).toBeUndefined();
  });

});

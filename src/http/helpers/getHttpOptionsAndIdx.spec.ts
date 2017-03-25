import * as module1 from './getHttpOptions';
import * as module2 from './getHttpOptionsIdx';
import { getHttpOptionsAndIdx } from './getHttpOptionsAndIdx';

describe('getHttpOptionsAndIdx() function', () => {
  let getHttpOptionsSpy: jasmine.Spy
    , getHttpOptionsIdxSpy: jasmine.Spy;

  beforeEach(() => {
    getHttpOptionsSpy = spyOn(module1, 'getHttpOptions');
    getHttpOptionsIdxSpy = spyOn(module2, 'getHttpOptionsIdx');
  });

  it('should call getHttpOptions() with `data`, `method` and `alwaysOriginal`=true args by default', () => {
    getHttpOptionsAndIdx([1], 'method');
    expect(getHttpOptionsSpy).toHaveBeenCalledWith([1], 'method', false);
  });

  it('should call getHttpOptions() with `data`, `method` and `alwaysOriginal` args', () => {
    getHttpOptionsAndIdx([1], 'method', true);
    expect(getHttpOptionsSpy).toHaveBeenCalledWith([1], 'method', true);
  });

  it('should call getHttpOptionsIdx() with `method` arg', () => {
    getHttpOptionsAndIdx([], 'method');
    expect(getHttpOptionsIdxSpy).toHaveBeenCalledWith('method');
  });

  it('should return object with values from getHttpOptions() and getHttpOptionsIdx() functions', () => {
    getHttpOptionsSpy.and.returnValue('options');
    getHttpOptionsIdxSpy.and.returnValue(5);

    expect(getHttpOptionsAndIdx([], 'method')).toEqual({
      options: 'options',
      idx: 5
    } as any);
  });

});

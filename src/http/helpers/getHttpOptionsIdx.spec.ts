import { getHttpOptionsIdx } from './getHttpOptionsIdx';

describe('getHttpOptionsIdx() function', () => {
  testGetHttpOptionsIdx('request', 1);
  testGetHttpOptionsIdx('get', 1);
  testGetHttpOptionsIdx('delete', 1);
  testGetHttpOptionsIdx('head', 1);
  testGetHttpOptionsIdx('options', 1);
  testGetHttpOptionsIdx('post', 2);
  testGetHttpOptionsIdx('put', 2);
  testGetHttpOptionsIdx('patch', 2);
});

function testGetHttpOptionsIdx(method: string, expextedIdx: number) {
  it(`should return '${expextedIdx}' for '${method}' method`, () =>
    expect(getHttpOptionsIdx(method)).toBe(expextedIdx));
}

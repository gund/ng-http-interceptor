import { RequestOptions } from '@angular/http';
import { getHttpOptionsIdx } from './getHttpOptionsIdx';
import { getHttpOptions } from './getHttpOptions';

/**
 * @description
 * Gets {@link RequestOptions} and it's index location in data array.
 * If no options found and `alwaysOriginal = false` - creates new {@link RequestOptions}.
 * @param data - Array of http data
 * @param method - Http method
 * @param alwaysOriginal - `false` by default
 */
export function getHttpOptionsAndIdx(data: any[], method: string, alwaysOriginal = false) {
  return {
    options: <RequestOptions>getHttpOptions(data, method, alwaysOriginal),
    idx: getHttpOptionsIdx(method)
  };
}

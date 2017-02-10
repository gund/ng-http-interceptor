import { RequestOptions } from '@angular/http';
import { getHttpOptionsIdx } from './getHttpOptionsIdx';

/**
 * @description
 * Gets http {@link RequestOptions} from data array.
 * If no options found and `alwaysOriginal = false` - returns new {@link RequestOptions}.
 * @param data - Array of http data
 * @param method - Http method
 * @param alwaysOriginal - `false` by default
 */
export function getHttpOptions(data: any[], method: string, alwaysOriginal = false): RequestOptions {
  return alwaysOriginal ?
    data[getHttpOptionsIdx(method)] :
    data[getHttpOptionsIdx(method)] || new RequestOptions();
}

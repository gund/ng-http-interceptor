import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Interceptable, Interceptor } from './interceptable';

export type RequestInterceptor = Interceptor<any[], any[]>;
export type ResponseInterceptor = Interceptor<Observable<Response>, Observable<Response>>;

export interface HttpInterceptor {
  request(): Interceptable<RequestInterceptor>;
  response(): Interceptable<ResponseInterceptor>;

  /** @private*/
  _interceptRequest(method: string, data: any[]): any[];
  /** @private */
  _interceptResponse(method: string, response: Observable<Response>): Observable<Response>;
}

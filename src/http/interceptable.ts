export interface Interceptable<T extends Interceptor<any, any>> {
  addInterceptor(interceptor: T): Interceptable<T>;
  removeInterceptor(interceptor: T): Interceptable<T>;
  clearInterceptors(interceptors?: T[]): Interceptable<T>;
}

export interface Interceptor<T, D> {
  (data: T, method: string, ctx?: any): D;
}

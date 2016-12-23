export const SAFE_PROXY_TRAPS = ['get', 'set', 'apply'];

export function identityFactory_(ref) {
  return ref;
}

export function identityFactory(provide, obj) {
  return {
    provide,
    useFactory: identityFactory_,
    deps: [obj]
  };
}

export function safeProxyHandler_(handler: any): any {
  const safeHandler = {};

  SAFE_PROXY_TRAPS
    .filter(trap => typeof handler[trap] === 'function')
    .forEach(trap => safeHandler[trap] = handler[trap].bind(handler));

  return safeHandler;
}

export function safeProxy(obj: any, handler: any): any {
  return new Proxy(obj, safeProxyHandler_(handler));
}

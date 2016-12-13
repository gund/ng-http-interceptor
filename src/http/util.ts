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

export const SAFE_PROXY_TRAPS = ['get', 'set', 'apply'];

export function safeProxyHandler_(handler: any, traps: string[]): any {
  const safeHandler = {};

  traps
    .filter(trap => typeof handler[trap] === 'function' && traps.indexOf(trap) !== -1)
    .forEach(trap => safeHandler[trap] = handler[trap].bind(handler));

  return safeHandler;
}

export function safeProxy(obj: any, handler: any, traps = SAFE_PROXY_TRAPS): any {
  return new Proxy(obj, safeProxyHandler_(handler, traps));
}

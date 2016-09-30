export const identityFactory = (provide, obj) => ({
  provide,
  useFactory: proxy => proxy,
  deps: [obj]
});

declare let Zone;

export const identityFactory = (provide, obj) => ({
  provide,
  useFactory: proxy => proxy,
  deps: [obj]
});

export function getContextFromCurrentZone() {
  let zone = Zone.current.getZoneWith('context');
  if (zone) {
    return zone.get('context');
  }
  return null;
};

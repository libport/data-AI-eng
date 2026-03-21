const NodeCache = require('node-cache');
const env = require('../config/env');

const cache = new NodeCache({
  stdTTL: env.cacheTtlSeconds,
  checkperiod: Math.max(1, Math.floor(env.cacheTtlSeconds / 2)),
  useClones: false
});

function getOrSet(key, loadFn) {
  const cached = cache.get(key);
  if (cached !== undefined) {
    return Promise.resolve(cached);
  }

  return loadFn().then((value) => {
    cache.set(key, value);
    return value;
  });
}

module.exports = {
  getOrSet,
  del: (key) => cache.del(key),
  flush: () => cache.flushAll()
};

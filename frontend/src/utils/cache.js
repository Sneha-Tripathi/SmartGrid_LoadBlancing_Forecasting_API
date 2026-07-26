/**
 * Simple in-memory cache with TTL support
 */
const cacheStore = new Map();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function getCacheKey(config) {
  const { method, url, params, data } = config || {};
  return JSON.stringify({ method, url, params, data });
}

export function getFromCache(key) {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cacheStore.delete(key);
    return null;
  }
  return entry.data;
}

export function setInCache(key, data, ttl = DEFAULT_TTL) {
  cacheStore.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
}

export function invalidateCache(pattern) {
  if (!pattern) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key);
    }
  }
}

export function getCacheSize() {
  return cacheStore.size;
}

export { DEFAULT_TTL };

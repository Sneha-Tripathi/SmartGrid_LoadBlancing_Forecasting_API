import { describe, it, expect, beforeEach } from "vitest";

const { getCacheKey, getFromCache, setInCache, invalidateCache, getCacheSize } = await import("../../utils/cache");

describe("Cache Utilities", () => {
  beforeEach(() => {
    invalidateCache();
  });

  describe("getCacheKey", () => {
    it("should generate a key from config", () => {
      const config = { method: "get", url: "/api/data", params: { id: 1 } };
      const key = getCacheKey(config);
      expect(key).toBeTruthy();
      expect(typeof key).toBe("string");
    });

    it("should generate same key for same config", () => {
      const config1 = { method: "get", url: "/api/data" };
      const config2 = { method: "get", url: "/api/data" };
      expect(getCacheKey(config1)).toBe(getCacheKey(config2));
    });

    it("should generate different keys for different configs", () => {
      const config1 = { method: "get", url: "/api/data" };
      const config2 = { method: "post", url: "/api/data" };
      expect(getCacheKey(config1)).not.toBe(getCacheKey(config2));
    });
  });

  describe("setInCache and getFromCache", () => {
    it("should store and retrieve data", () => {
      setInCache("test-key", { value: 42 });
      const result = getFromCache("test-key");
      expect(result).toEqual({ value: 42 });
    });

    it("should return null for non-existent key", () => {
      expect(getFromCache("non-existent")).toBeNull();
    });

    it("should expire cache after TTL", async () => {
      setInCache("expire-key", "data", 10); // 10ms TTL
      await new Promise(r => setTimeout(r, 15));
      expect(getFromCache("expire-key")).toBeNull();
    });
  });

  describe("invalidateCache", () => {
    it("should clear specific keys matching pattern", () => {
      setInCache("/api/users", [1, 2]);
      setInCache("/api/posts", [3, 4]);
      invalidateCache("/api/users");
      expect(getFromCache("/api/users")).toBeNull();
      expect(getFromCache("/api/posts")).toEqual([3, 4]);
    });

    it("should clear all cache when no pattern", () => {
      setInCache("key1", 1);
      setInCache("key2", 2);
      invalidateCache();
      expect(getFromCache("key1")).toBeNull();
      expect(getFromCache("key2")).toBeNull();
    });
  });

  describe("getCacheSize", () => {
    it("should return zero for empty cache", () => {
      expect(getCacheSize()).toBe(0);
    });

    it("should return correct cache size", () => {
      setInCache("key1", 1);
      setInCache("key2", 2);
      expect(getCacheSize()).toBe(2);
    });
  });
});

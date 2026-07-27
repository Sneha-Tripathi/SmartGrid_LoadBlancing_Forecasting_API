import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Enhanced useApi hook with cancellation, and proper loading/error states.
 * Retry is handled by the Axios interceptor in api.js.
 *
 * @param {Function} apiFunction - An async function that returns data
 * @param {Object} options
 * @param {Array} options.dependencies - useEffect dependencies
 * @param {boolean} options.enabled - Conditionally enable the request (default: true)
 * @param {function} options.onSuccess - Callback on success
 * @param {function} options.onError - Callback on error
 * @param {*} options.initialData - Initial data value before fetch
 * @returns {{ data, loading, error, execute, refresh, cancel, setData }}
 */
export default function useApi(apiFunction, options = {}) {
  const {
    dependencies: deps = [],
    enabled = true,
    onSuccess,
    onError,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const execute = useCallback(async (overrideFn) => {
    const fn = overrideFn || apiFunction;
    if (typeof fn !== "function") return;

    // Cancel any in-flight request
    cancel();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const attemptFetch = async () => {
      if (!mountedRef.current || controller.signal.aborted) return;

      try {
        const result = await fn(controller.signal);

        if (mountedRef.current && !controller.signal.aborted) {
          setData(result);
          setError(null);
          onSuccess?.(result);
        }
      } catch (err) {
        if (!mountedRef.current || controller.signal.aborted) return;

        // Note: Retry is handled by the Axios interceptor (api.js).
        // We don't retry here to avoid duplicate retries.
        setError(err);
        onError?.(err);
      }
    };

    await attemptFetch();

    if (mountedRef.current) {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, cancel]);

  const refresh = useCallback(() => {
    // Clear cache for this request if cached
    if (typeof apiFunction === "function") {
      // We can't easily clear cache without a config, but execute will refetch
    }
    return execute();
  }, [execute]);

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled || typeof apiFunction !== "function") {
      setLoading(false);
      return;
    }

    execute();

    return () => {
      mountedRef.current = false;
      cancel();
    };
  }, [enabled, ...deps]);

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    cancel,
    setData,
  };
}

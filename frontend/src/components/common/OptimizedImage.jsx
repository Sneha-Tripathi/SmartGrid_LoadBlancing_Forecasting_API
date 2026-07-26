import { useState, useCallback, memo } from "react";
import { FaImage, FaExclamationTriangle } from "react-icons/fa";

const PLACEHOLDER_BASE64 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23101827'/%3E%3C/svg%3E";

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  className = "",
  lazy = true,
  fallback = null,
  onLoad,
  onError,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    onError?.();
  }, [onError]);

  if (error && fallback) {
    return fallback;
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-[#101827] border border-slate-800 rounded-xl ${className}`}
        style={{ width, height }}
      >
        <FaExclamationTriangle className="text-red-400 text-2xl" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Blur placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-[#101827] animate-pulse flex items-center justify-center">
          <FaImage className="text-slate-600 text-2xl" />
        </div>
      )}

      <img
        src={src || PLACEHOLDER_BASE64}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
      />
    </div>
  );
});

export default OptimizedImage;

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import authService from "../services/authService";

const AuthContext = createContext();

const SESSION_EXPIRY_KEY = "sg-session-expiry";
const ACCESS_TOKEN_KEY = "sg-access-token";
const REFRESH_TOKEN_KEY = "sg-refresh-token";
const USER_KEY = "sg-user";
const REMEMBER_ME_KEY = "sg-remember-me";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState({ accessToken: null, refreshToken: null });

  // ---------- Token & session helpers ----------

  const clearAuth = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    setUser(null);
    setTokens({ accessToken: null, refreshToken: null });
  }, []);

  const isSessionExpired = useCallback(() => {
    const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);
    if (!expiry) return false;
    return Date.now() > Number(expiry);
  }, []);

  // ---------- Bootstrap auth from storage ----------

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === "true";

        if (!accessToken || !refreshToken || !savedUser) {
          setLoading(false);
          return;
        }

        // Check session expiry (only if "remember me" was set)
        if (rememberMe && isSessionExpired()) {
          clearAuth();
          toast.error("Session expired - please login again");
          setLoading(false);
          return;
        }

        setTokens({ accessToken, refreshToken });

        // Try to fetch current user, fall back to cached data if backend is down
        try {
          const userData = await authService.getMe();
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch {
          // Backend might be offline - use cached user data
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
        }
      } catch (err) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Login ----------

  const login = useCallback(async (email, password, rememberMe = false) => {
    const data = await authService.login(email, password);

    const { access_token, refresh_token, expires_in, ...userData } = data;

    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));

    if (rememberMe) {
      const expiry = Date.now() + expires_in * 1000;
      localStorage.setItem(SESSION_EXPIRY_KEY, String(expiry));
    } else {
      localStorage.removeItem(SESSION_EXPIRY_KEY);
    }

    setTokens({ accessToken: access_token, refreshToken: refresh_token });
    setUser(userData);

    return userData;
  }, []);

  // ---------- Register ----------

  const register = useCallback(async (name, email, password, phone = "") => {
    const data = await authService.register(name, email, password, phone);

    const { access_token, refresh_token, expires_in, ...userData } = data;

    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(REMEMBER_ME_KEY, "false");

    setTokens({ accessToken: access_token, refreshToken: refresh_token });
    setUser(userData);

    return userData;
  }, []);

  // ---------- Logout ----------

  const logout = useCallback(async () => {
    try {
      const refToken = tokens.refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refToken) {
        await authService.logout(refToken);
      }
    } catch {
      // Even if the API call fails, clear local state
    }
    clearAuth();
  }, [tokens.refreshToken, clearAuth]);

  // ---------- Update profile ----------

  const updateProfile = useCallback(async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    return updated;
  }, []);

  // ---------- Change password ----------

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    return authService.changePassword(currentPassword, newPassword);
  }, []);

  // ---------- Role check ----------

  const hasRole = useCallback(
    (requiredRole) => {
      if (!user) return false;
      if (requiredRole === "admin") return user.role === "admin";
      if (requiredRole === "operator")
        return user.role === "admin" || user.role === "operator";
      return true;
    },
    [user]
  );

  // ---------- Context value ----------

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

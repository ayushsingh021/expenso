import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = "http://192.168.250.242:4000/api/v1";

// ----------- Types -----------
interface User {
  _id: string;
  email: string;
  fullName: string;
  username: string;
  avatar?: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  hasInitialized: boolean;

  register: (formData: FormData) => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  refreshToken: () => Promise<string>;
}

// ----------- Store -----------
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  hasInitialized: false,

  // ---------- Register ----------
  register: async (formData: FormData) => {
    try {
      set({ isLoading: true });

      const res = await axios.post(`${API_BASE_URL}/users/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const { user, accessToken, refreshToken } = res.data.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      set({ user, token: accessToken });
    } catch (err) {
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------- Login ----------
  login: async ({ email, password }: AuthCredentials) => {
    try {
      set({ isLoading: true });

      const res = await axios.post(
        `${API_BASE_URL}/users/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      const { accessToken, refreshToken, user } = res.data.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      set({ user, token: accessToken });
    } catch (err) {
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------- Logout ----------
  logout: async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    set({ user: null, token: null });
  },

  // ---------- Initialize on App Start ----------
  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      let finalToken = token;

      if (!token && refreshToken) {
        // Attempt to refresh access token
        try {
          finalToken = await get().refreshToken();
        } catch {
          throw new Error("Token refresh failed");
        }
      }

      if (!finalToken) return;

      const res = await axios.get(`${API_BASE_URL}/users/get-current-user`, {
        headers: { Authorization: `Bearer ${finalToken}` },
      });

      const user = res.data.data;

      set({ user, token: finalToken });
    } catch (err) {
      // On error (e.g., expired token or fetch failed), logout
      await get().logout();
    } finally {
      set({ hasInitialized: true }); // ✅ typo fixed
    }
  },

  // ---------- Refresh Access Token ----------
  refreshToken: async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem("refreshToken");

      if (!storedRefreshToken) throw new Error("No refresh token found");

      const res = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
        refreshToken: storedRefreshToken,
      });

      const newAccessToken: string = res.data.data.accessToken;

      await AsyncStorage.setItem("accessToken", newAccessToken);
      set({ token: newAccessToken });

      return newAccessToken;
    } catch (err) {
      await get().logout();
      throw err;
    }
  },
}));

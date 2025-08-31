import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "./config";
import { getStoredAuth } from "./utils/auth-local-storage";
import type Auth from "./types/Auth";
import { triggerLogout } from "./utils/auth-logout-helper";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "6666",
  },
});

api.interceptors.request.use(
  (config) => {
    const auth: Auth | undefined = getStoredAuth();
    if (auth?.token && config.url && !config.url.startsWith("/auth")) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.startsWith("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      toast.error("Session expired. Logging out...", {
        isLoading: false,
        closeButton: true,
        autoClose: 3000,
      });
      triggerLogout();
    }
    return Promise.reject(error);
  }
);

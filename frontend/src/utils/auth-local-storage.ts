import type Auth from "../types/Auth";

export const getStoredAuth = (): Auth | undefined => {
  const stored = localStorage.getItem("auth");
  return stored ? JSON.parse(stored) : undefined;
};

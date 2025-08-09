import { create } from "zustand";
import api from "../api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    set({ user: res.data, token: res.data.token });
    localStorage.setItem("token", res.data.token);
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    // Optionally verify with backend
    // const res = await api.get("/auth/me");
    // set({ user: res.data, token });
  },
}));

import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: async ({ email, password }) => {
    const res = await axios.post("/api/auth/login", { email, password });
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
    // const res = await axios.get("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
    // set({ user: res.data, token });
  },
}));

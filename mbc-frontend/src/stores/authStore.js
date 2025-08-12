// src/stores/authStore.js
import { create } from "zustand";
import { persist } from 'zustand/middleware';
import api from "../api/axios"; // Use the central API service

// We use persist middleware to automatically save auth state to localStorage
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (credentials) => {
        try {
            // no /v1 prefix here, proxy rewrite handles it
            const { data } = await api.post('/auth/login', credentials);
            if (!data.token) throw new Error('No token received');

            set({ user: data.user, token: data.token });
            return data.user;
          } catch (err) {
            const errorMsg = err.response?.data?.error || 
                            err.response?.data?.message || 
                            'Login failed. Please try again.';
            console.error('Login error:', errorMsg);
            throw new Error(errorMsg);
  }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        // This function verifies the existing token with a backend endpoint
        // It's useful for session persistence when the app loads
        try {
          const { data } = await api.get("/users/me"); // Assumes a '/users/me' endpoint exists
          set({ user: data.data }); // Assuming user data is in response.data.data
        } catch (err) {
          console.error("Auth check failed:", err.response?.data || err.message);
          set({ user: null, token: null });
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage', // Name for the localStorage item
      partialize: (state) => ({ token: state.token, user: state.user }), // Only persist the token and user
    }
  )
);
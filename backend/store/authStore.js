import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

//  Axios instance (single source of truth)
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const useAuth = create(
  persist(
    (set) => ({
      currentUser: null,
      loading: false,
      isAuthenticated: false,
      error: null,

      // 🔐 LOGIN
      login: async (userCredWithRole) => {
        try {
          set({ loading: true, error: null });

          const res = await api.post(
            "/common-api/authenticate",
            userCredWithRole
          );

          set({
            loading: false,
            isAuthenticated: true,
            currentUser: res.data.payload,
          });
        } catch (err) {
          console.log("Login error:", err);

          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Login failed",
          });
        }
      },

      // 🚪 LOGOUT
      logout: async () => {
        try {
          set({ loading: true, error: null });

          await api.get("/common-api/logout");

          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
          });
        } catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            error: err.response?.data?.error || "Logout failed",
          });
        }
      },

      //  CHECK AUTH (restore session)
      checkAuth: async () => {
        try {
          set({ loading: true, error: null });

          const res = await api.get("/common-api/check-auth");

          set({
            currentUser: res.data.payload,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          if (err.response?.status === 401) {
            set({
              currentUser: null,
              isAuthenticated: false,
              loading: false,
            });
            return;
          }

          console.error("Auth check failed:", err);
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // persists in localStorage
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }), // don’t persist loading/error
    }
  )
);
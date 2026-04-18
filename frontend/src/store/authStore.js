import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({

  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCredObj) => {

    try {

      set({ loading: true, error: null });

      let res = await axios.post(
        "http://localhost:4000/common-api/login",
        userCredObj,
        { withCredentials: true }
      );

      console.log("✅ Login success:", res.data);
      console.log("👤 Payload received:", res.data.payload);

      set({
        loading: false,
        error: null,
        isAuthenticated: true,
        currentUser: res.data.payload
      });

    } catch (err) {

      console.log("❌ Login error:", err);

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password"
      });

    }

  }, 


  logout: async () => {

    try {

      set({ loading: true, error: null });

      await axios.get("http://localhost:4000/common-api/logout", { withCredentials: true });

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: null
      });

    } catch (err) {

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Logout failed"
      });

    }

  }

}));
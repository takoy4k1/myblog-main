import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import {toast} from "react-hot-toast"

function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const login = useAuth(state => state.login);
  const isAuthenticated = useAuth(state => state.isAuthenticated);
  const currentUser = useAuth(state => state.currentUser);
  const error = useAuth(state => state.error);
  const loading = useAuth(state => state.loading); // FIX 1: read loading state

  const navigate = useNavigate();

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === "USER") {
        toast.success("Logged in Successfully!")
        navigate("/user-profile");
      }
      if (currentUser.role === "AUTHOR") {
        navigate("/author-profile");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const onSubmit = (data) => {
    // FIX 2: removed console.log(data) — was leaking passwords
    onUserLogin(data);
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">

    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="bg-white w-full max-w-sm p-8 rounded-xl shadow-sm border border-gray-200"
    >

      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Login
      </h2>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        className="w-full border border-gray-300 p-2 mb-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        {...register("email", { required: "Email is required" })}
      />
      <p className="text-red-500 text-xs mb-2">{errors.email?.message}</p>

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 p-2 mb-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        {...register("password", { required: "Password is required" })}
      />
      <p className="text-red-500 text-xs mb-2">{errors.password?.message}</p>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 px-3 py-2 rounded text-sm mb-3">
          {error}
        </div>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-3 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </form>
  </div>
);
}

export default Login;

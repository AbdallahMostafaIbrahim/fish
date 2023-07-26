import React, { useState } from "react";
import { useUserStore } from "../utils/store/user";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import Loader from "../components/Loader";

interface Props {}

interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC<Props> = () => {
  const { user, setUser } = useUserStore();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    try {
      setIsLoginLoading(true);
      const res = await axios.post<{
        code: number;
        message: string;
        user: { id: string; email: string; name: string };
      }>("/api/auth/login", data);
      if (res.data.code == 200) {
        setUser(res.data.user);
      } else {
        setError("password", { message: "Invalid email or password" });
      }
      setIsLoginLoading(false);
    } catch (err) {
      setIsLoginLoading(false);
      setError("password", { message: "Server error" });
    }
  };

  if (user) return <Navigate to="/admin" />;

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center">
      <nav className="w-full p-6 fixed top-0 flex justify-center shadow-lg bg-gray-800 text-gray-200">
        <h1 className="text-3xl font-semibold">Fish</h1>
      </nav>
      <h1 className="text-4xl font-bold text-emerald-500 mt-20">Login</h1>
      <div className="w-[400px] bg-gray-800 rounded-lg shadow-lg p-10 mt-8 transition-all duration-300 border-2 border-transparent border-gray-100 border-opacity-10 hover:border-opacity-20">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="border-2 border-gray-700 rounded-lg px-4 py-2 text-lg bg-gray-700 text-gray-200 transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          <div className="h-6"></div>
          <input
            className={twMerge(
              "border-2 border-gray-700 rounded-lg px-4 py-2 text-lg bg-gray-700 text-gray-200 transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300",
              errors.password?.message &&
                "ring-2 ring-red-400 hover:ring-red-400 focus:ring-red-400"
            )}
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          <div className="h-4"></div>
          <p className="text-red-400 text-sm h-4">
            {errors.password && errors.password.message}
          </p>
          <div className="h-4"></div>
          <button className="bg-emerald-500 text-white rounded-lg px-4 py-2 text-lg transition-all duration-300 hover:bg-emerald-600 focus:ring-emerald-300 focus:ring-2">
            {isLoginLoading ? <Loader size={24} /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

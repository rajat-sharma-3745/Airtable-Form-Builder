import React, { useState } from "react";
import login from "../assets/login.png";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
import { GrStatusWarning } from "react-icons/gr";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(API_PATHS.AUTH.LOGIN);
      if (data) window.location.href = data;
    } catch (error) {
      toast.error(
        (error?.response?.data?.message ||
          error?.message) ||
          "Something went wrong"
      );
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:flex w-1/2">
        <img
          className="h-full w-full object-cover"
          src={login}
          alt="leftSideImage"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <div className="md:w-96 w-80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
          <button
            onClick={handleLogin}
            className="mt-8 cursor-pointer flex justify-center items-center w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            {loading?<LuLoaderCircle className="animate-spin text-center"/>:"Login with Airtable"}
          </button>
          {loading &&  <div className="mt-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm flex items-center gap-2">
          <GrStatusWarning/>
          <span>
            Our server is waking up — this may take a few seconds since it's
            hosted on Render.
          </span>
        </div>}
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAppContext } from "../Context/AppContext";
import { toast } from "sonner";

const Loader = () => {
  const { setUser } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    async function fetchUser() {
      
      try {
        const { data } = await axiosInstance.get(API_PATHS.AUTH.CALLBACK, {
          params: {
            code: searchParams.get("code"),
            state: searchParams.get("state"),
          },
        });
        if (data?.success) {
          toast.success(data?.message);
          localStorage.setItem("user", JSON.stringify(data?.user));
          setUser(data?.user);
          navigate("/");
        }
      } catch (error) {
        toast.error('Error while logging in')
      }
    }
    fetchUser();
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-24 w-24 rounded-full border-4 border-t-amber-400 border-gray-300 animate-spin"></div>
    </div>
  );
};

export default Loader;

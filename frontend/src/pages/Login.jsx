import React, { useState } from "react";
import login from "../assets/login.png";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { toast } from "sonner";
import { useAppContext } from "../Context/AppContext";

const Login = () => {

  // const {setUser} = useAppContext();


  const handleLogin = async()=>{
    try {
    const{data} =  await axiosInstance.get(API_PATHS.AUTH.LOGIN)
    if(data) window.location.href = data
    } catch (error) {
      console.log(error)
    }
  }



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
        <div
       
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium">
            Sign in
          </h2>
          {/* <p className="text-sm text-gray-500/90 my-3">
            {isLogin
              ? "Welcome back! Please sign in to continue"
              : "Welcome! Create your account below"}
          </p> */}
         

          <button
           onClick={handleLogin}
            className="mt-8 cursor-pointer w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
          Login with Airtable
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from 'react'

import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const Loader = () => {
   const [searchParams,setSearchParams] = useSearchParams();



    useEffect(()=>{
        if(searchParams){
          const [code,state] = [searchParams.get('code'),searchParams.get('state')]
           const {data} = axiosInstance.get(API_PATHS.AUTH.CALLBACK,{
            params:{
              code:code,
              state:state
            }
           })
           if(data) console.log(data);
        }
    },[])

  return (
    <div className='flex justify-center items-center h-screen'>
       <div className='h-24 w-24 rounded-full border-4 border-t-amber-400 border-gray-300 animate-spin'></div>
    </div>
  )
}

export default Loader
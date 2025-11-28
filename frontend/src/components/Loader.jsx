import React from 'react'

import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Loader = () => {
   const [searchParams,setSearchParams] = useSearchParams();



    useEffect(()=>{
         console.log(searchParams)
    },[])

  return (
    <div className='flex justify-center items-center h-screen'>
       <div className='h-24 w-24 rounded-full border-4 border-t-amber-400 border-gray-300 animate-spin'></div>
    </div>
  )
}

export default Loader
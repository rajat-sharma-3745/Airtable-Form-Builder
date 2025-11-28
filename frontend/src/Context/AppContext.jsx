import React, { createContext, useContext, useState } from "react";
import { Toaster } from "sonner";

const AppContext = createContext(null);


const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const logout = () => {
    setUser(null);
    localStorage.clear();
  };
  const value={setUser,user,logout}
  return <AppContext.Provider value={value}>
    <Toaster position="top-right" />
   {children}
  </AppContext.Provider>
};

export const useAppContext = () => useContext(AppContext);
export default AppProvider;

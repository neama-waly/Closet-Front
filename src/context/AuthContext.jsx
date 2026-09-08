import { createContext, useContext, useState } from "react";
const AuthContext = createContext();

export function AuthProvider({children}){
    const [user , setUser] = useState(()=>{
        const savedUser = localStorage.getItem("closet_user");
        return savedUser ? JSON.parse(savedUser) : null ; 
    });
    const [token , setToken ] =useState(()=>{
        return localStorage.getItem("closet_token") || null;
    });

    const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("closet_user", JSON.stringify(userData));
    localStorage.setItem("closet_token", userToken);
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("closet_user");
    localStorage.removeItem("closet_token");
  };
  const isAdmin = user?.role === "ADMIN";

  return(
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
        {children}
    </AuthContext.Provider>
  )

}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { AuthContext } from "./authContext";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName") || null
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );

  const login = (userName: string, token: string) => {
    setUserName(userName);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);
  };
  return (
    <AuthContext.Provider value={{ userName, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { AuthContext } from "./authContext";

const USER_NAME_KEY = "userName";
const TOKEN_KEY = "token";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem(USER_NAME_KEY) || null
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN_KEY) || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem(TOKEN_KEY) ? true : false
  );
  const login = (userName: string, token: string) => {
    setUserName(userName);
    setToken(token);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_NAME_KEY, userName);
    setIsAuthenticated(true);
  };
  const logout = () => {
    setUserName(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ userName, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import { createContext, useContext } from "react";

interface IAuthContext {
    userName: string | null;
    token: string | null;
    login: (userName: string, token: string) => void;
}

export const AuthContext = createContext<IAuthContext>({
    userName: null,
    token: null,
    login: () => {},
});

export const useAuth = () => useContext(AuthContext);


import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getStoredAuth } from "../utils/auth-local-storage";
import type Auth from "../types/Auth";
import { useNavigate } from "react-router";
import { setLogoutHandler } from "../utils/auth-logout-helper";
interface Props {
  children: ReactNode;
}

interface AuthContextInterface {
  auth: Auth | undefined;
  setAuth: Dispatch<SetStateAction<Auth | undefined>>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextInterface>({
  auth: getStoredAuth(),
  setAuth: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<Auth | undefined>(getStoredAuth());
  const isAuthenticated = !!(auth?.token && auth?.username);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      setAuth(undefined);
      localStorage.removeItem("auth");
      navigate("/login", { replace: true });
    };
    setLogoutHandler(logout);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

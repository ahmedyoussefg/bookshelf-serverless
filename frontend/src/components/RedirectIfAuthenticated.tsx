import { type ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router";

interface Props {
  children: ReactNode;
  redirectPath?: string;
}

// Redirect login or register to /dashboard if already authenticated
function RedirectIfAuthenticated({
  children,
  redirectPath = "/dashboard",
}: Props) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to={redirectPath} replace></Navigate>
  ) : (
    children
  );
}

export default RedirectIfAuthenticated;

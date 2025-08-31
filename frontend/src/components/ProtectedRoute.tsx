import { type ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router";

interface Props {
  children: ReactNode;
  redirectPath?: string;
}
function ProtectedRoute({ children, redirectPath = "/login" }: Props) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectPath} replace></Navigate>
  );
}

export default ProtectedRoute;

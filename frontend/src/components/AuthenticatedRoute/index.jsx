import { Navigate } from "react-router";
import { useAuth } from "@context/AuthContext";

const AuthenticatedRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthenticatedRoute;

import { Navigate } from "react-router";
import { useAuth } from "@context/AuthContext";
import SpinnerLoader from "../SpinnerLoader";


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <SpinnerLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

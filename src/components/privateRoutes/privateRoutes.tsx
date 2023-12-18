import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../../contexts/userStateContext";

const PrivateRoutes = () => {
  const { user } = useUser();
  return user.token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;

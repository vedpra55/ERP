import { useAuthContext } from "@context/AuthContext";
import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {}

const RequiredAuth: FC<Props> = ({}) => {
  const { user } = useAuthContext();

  return user.email ? <Outlet /> : <Navigate to="/" />;
};

export default RequiredAuth;

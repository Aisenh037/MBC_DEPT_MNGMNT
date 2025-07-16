import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function PrivateRoute({ allowedRoles }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return <Outlet />;
}

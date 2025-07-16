import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function RequireAuth({ allowedRoles = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        await checkAuth();
        if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
          return navigate("/unauthorized");
        }
        setLoading(false);
      } catch {
        navigate("/", { replace: true, state: { from: location } });
      }
    }
    verify();
    // eslint-disable-next-line
  }, [user, allowedRoles, location, navigate]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  return <Outlet />;
}

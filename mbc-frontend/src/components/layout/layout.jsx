import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function Layout() {
  const { user, logout } = useAuthStore();

  return (
    <>
      <header className="sticky top-0 bg-white shadow flex items-center px-8 py-3 z-40">
        <img src="/logo.png" alt="Logo" className="w-10 mr-4" />
        <span className="text-xl font-bold text-blue-700 flex-1">MBC Department Portal</span>
        {user && (
          <div className="flex items-center gap-4">
            <span className="font-medium text-blue-600">{user.name} ({user.role})</span>
            <button
              onClick={logout}
              className="bg-blue-600 text-white rounded px-5 py-2 font-semibold hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <main className="px-4 py-8 min-h-[calc(100vh-64px)] bg-gray-50">
        <Outlet />
      </main>
    </>
  );
}

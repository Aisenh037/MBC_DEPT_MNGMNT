import React from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { key: "login", label: "Login", to: "/login" },
  { key: "forgot", label: "Forgot Password", to: "/forgot-password" }
];

export default function SidebarMenu() {
  const location = useLocation();
  return (
    <nav className="flex flex-col space-y-2 w-44 py-8 px-3 bg-blue-50 rounded-xl shadow-md items-center">
      {items.map((item) => (
        <Link
          key={item.key}
          to={item.to}
          className={`w-full text-center py-2 rounded font-medium transition
            ${location.pathname === item.to
              ? "bg-blue-600 text-white"
              : "text-blue-700 hover:bg-blue-100"}
          `}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

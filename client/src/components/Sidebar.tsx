import React from "react";
import { useUserStore } from "../utils/store/user";
import { useNavigate, useMatch, Link } from "react-router-dom";
import { Home, Users, Globe, Layout, LogOut, Mail } from "lucide-react";
import axios from "axios";

const Sidebar: React.FC = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {}
    setUser(undefined);
    navigate("/admin/auth/login");
  };

  const getNavLinkClass = (path: string) => {
    return useMatch(path) ? "text-emerald-500" : "text-gray-200";
  };

  return (
    <div className="w-64 min-h-screen bg-gray-800 text-gray-200 p-6">
      <h1 className="text-3xl font-semibold mb-4">Admin</h1>
      <p className="mb-8">Logged in as: {user?.name}</p>
      <nav>
        <Link
          className={`flex items-center gap-2 mb-2 hover:text-emerald-500 ${getNavLinkClass(
            "/admin"
          )}`}
          to="/admin"
        >
          <Home />
          Home
        </Link>
        <Link
          className={`flex items-center gap-2 mb-2 hover:text-emerald-500 ${getNavLinkClass(
            "/admin/campaigns"
          )}`}
          to="/admin/campaigns"
        >
          <Globe />
          Campaigns
        </Link>
        <Link
          className={`flex items-center gap-2 mb-2 hover:text-emerald-500 ${getNavLinkClass(
            "/admin/users"
          )}`}
          to="/admin/users"
        >
          <Users />
          Users
        </Link>
        <Link
          className={`flex items-center gap-2 mb-2 hover:text-emerald-500 ${getNavLinkClass(
            "/admin/templates"
          )}`}
          to="/admin/templates"
        >
          <Layout />
          Website Templates
        </Link>
        <Link
          className={`flex items-center gap-2 mb-2 hover:text-emerald-500 ${getNavLinkClass(
            "/admin/emails"
          )}`}
          to="/admin/emails"
        >
          <Mail />
          Email Templates
        </Link>
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-2 mt-8 text-gray-200 hover:text-emerald-500"
      >
        <LogOut />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

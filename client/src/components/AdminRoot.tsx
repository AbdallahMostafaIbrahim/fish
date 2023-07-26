import React from "react";
import Sidebar from "./Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../utils/store/user";

const AdminRoot: React.FC = () => {
  const { user } = useUserStore();
  if (!user) return <Navigate to="/admin/login" />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminRoot;

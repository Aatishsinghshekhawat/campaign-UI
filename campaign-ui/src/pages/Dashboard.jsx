import React from "react";
import { NavLink, Outlet, useLocation, matchPath } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  const isTemplatesActive = location.pathname.startsWith("/template");
  const isCampaignsActive = location.pathname.startsWith("/campaigns");

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <nav className="space-y-4 flex-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `block w-full text-left px-4 py-2 rounded transition-colors duration-200 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/user/list"
            className={({ isActive }) =>
              `block w-full text-left px-4 py-2 rounded transition-colors duration-200 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/list"
            className={({ isActive }) =>
              `block w-full text-left px-4 py-2 rounded transition-colors duration-200 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Lists
          </NavLink>
          <NavLink
            to="/template"
            className={() =>
              `block w-full text-left px-4 py-2 rounded transition-colors duration-200 ${
                isTemplatesActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Templates
          </NavLink>
          <NavLink
            to="/campaigns"
            className={({ isActive }) =>
              `block w-full text-left px-4 py-2 rounded transition-colors duration-200 ${
                isActive || isCampaignsActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Campaigns
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute.jsx";
import List from "./pages/List";
import ListItem from "./pages/ListItem";
import TemplatePage from "./pages/TemplatePage";
import TemplateBuilder from "./pages/TemplateBuilder";
import CreateTemplate from "./pages/CreateTemplate";
import TemplateView from "./pages/TemplateView";
import UserList from "./pages/UserList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardLayout = () => <Dashboard />;

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<div className="text-3xl font-semibold text-gray-700">Welcome to Dashboard</div>} />

        <Route path="user/list" element={<UserList />} />

        <Route path="list" element={<Outlet />}>
          <Route index element={<List />} />
          <Route path=":id" element={<ListItem />} />
        </Route>

        <Route path="template" element={<Outlet />}>
          <Route index element={<TemplatePage />} />
          <Route path="create" element={<CreateTemplate />} />
          <Route path="builder/:id" element={<TemplateBuilder />} />
          <Route path="view/:id" element={<TemplateView />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  </BrowserRouter>
);

export default App;

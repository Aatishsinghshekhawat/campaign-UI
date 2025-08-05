import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import List from "./pages/List";
import ListItem from "./pages/ListItem";
import TemplatePage from "./pages/TemplatePage";
import TemplateBuilder from "./pages/TemplateBuilder";
import CreateTemplate from "./pages/CreateTemplate";
import TemplateView from "./pages/TemplateView";
import UserList from "./pages/UserList";
import CampaignsPage from "./pages/CampaignsPage";
import CreateCampaign from "./pages/CreateCampaign";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WelcomeDashboard = () => (
  <div className="text-3xl font-semibold text-gray-700">Welcome to Dashboard</div>
);

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
        <Route path="dashboard" element={<WelcomeDashboard />} />
        <Route path="user/list" element={<UserList />} />
        <Route path="list" element={<List />} />
        <Route path="list/:id" element={<ListItem />} />
        <Route path="template" element={<TemplatePage />} />
        <Route path="template/create" element={<CreateTemplate />} />
        <Route path="template/builder/:id" element={<TemplateBuilder />} />
        <Route path="template/view/:id" element={<TemplateView />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/create" element={<CreateCampaign />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  </BrowserRouter>
);

export default App;
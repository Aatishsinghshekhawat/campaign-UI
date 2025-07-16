import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute.jsx';
import ListItem from './pages/ListItem';
import Template from './pages/Template';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTemplate from "./pages/CreateTemplate";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/list/:id"
          element={
            <PrivateRoute>
              <ListItem />
            </PrivateRoute>
          }
        />

        <Route
          path="/template"
          element={
            <PrivateRoute>
              <Template />
            </PrivateRoute>
          }
        />
        <Route
          path="/template/create"
          element={
            <PrivateRoute>
             <Dashboard initialView="create-template" />
            </PrivateRoute>
          }
        /> 
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </BrowserRouter>
  );
};

export default App;

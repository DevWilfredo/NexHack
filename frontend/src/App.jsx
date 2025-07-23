import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import FaviconUpdater from "./components/FaviconUpdater";
import PrivateRoute from "./components/PrivateRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import HackathonsPage from "./pages/Hackathons";
import TeamsPage from "./pages/Teams";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/Register";

const App = () => {
  return (
    <>
      <FaviconUpdater />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* Rutas públicas solo si NO está logueado */}
          <Route
            path="/login"
            element={
              <AuthenticatedRoute>
                <LoginPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthenticatedRoute>
                <RegisterPage />
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/hackathons/:hackathonId"
            element={
              <PrivateRoute>
                <HackathonsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/hackathons/:hackathonId/teams/:teamId"
            element={
              <PrivateRoute>
                <TeamsPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;

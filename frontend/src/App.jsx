import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import FaviconUpdater from "./components/FaviconUpdater";
import PrivateRoute from "./components/PrivateRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import HackathonsPage from "./pages/Hackathons";
import TeamsPage from "./pages/Teams";

const App = () => {
  return (
    <>
      <FaviconUpdater />
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
                <Login />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthenticatedRoute>
                <Register />
              </AuthenticatedRoute>
            }
          />

          <Route
            path="/hackathons/:hackathonId"
            element={<HackathonsPage />}
          />
          <Route
            path="/hackathons/:hackathonId/teams/:teamId"
            element={<TeamsPage />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;

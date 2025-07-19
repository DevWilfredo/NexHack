import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import FaviconUpdater from "./components/FaviconUpdater";
import HackathonsPage from "./pages/Hackathons";
import TeamsPage from "./pages/Teams";

const App = () => {
  return (
    <>
      <FaviconUpdater />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/hackathons/:hackathonId" element={<HackathonsPage />} />
          <Route
            path="/hackathons/:hackathonId/teams/:teamId"
            element={<TeamsPage />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;

import React from "react";
import { Route, Routes, Navigate } from "react-router";
import FaviconUpdater from "./components/FaviconUpdater";
import ShiftingCountdown from "./components/AnimatedCountdown";

const App = () => {
  return (
    <>
      <FaviconUpdater />
      <Routes>
        <Route path="/" element={<ShiftingCountdown />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;

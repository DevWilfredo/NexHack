import React from "react";
import { Route, Routes, Navigate } from "react-router";
import ShiftingCountdown from "./components/AnimatedCountdown";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ShiftingCountdown />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;

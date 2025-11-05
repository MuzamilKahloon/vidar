import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import MetaTrade from "./pages/MetaTrade";
import IA from "./pages/IA";

function LayoutWrapper() {
  return (
    <>
      {/* Sidebar visible on all pages */}
      <Sidebar />

      {/* Main content area with left margin for sidebar */}
      <div className="ml-48">
        {/* Navbar visible on all pages */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<MetaTrade />} />
          <Route path="/ia" element={<IA />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
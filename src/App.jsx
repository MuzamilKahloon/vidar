import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import MetaTrade from "./pages/MetaTrade";
import IA from "./pages/IA";

function LayoutWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsSidebarOpen(!mediaQuery.matches);

    const handleResize = (e) => {
      setIsSidebarOpen(!e.matches);
    };

    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <>
      {/* Sidebar visible on all pages */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main content area with left margin for sidebar */}
      <div className="lg:ml-48 ml-0">
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
import React from "react";
import { Outlet } from "react-router-dom"; // Placeholder for matching page routes
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";

export default function DashboardLayout() {
  const { isDarkMode } = useTheme();

  return (
    <div  className="min-vh-100 d-flex flex-column w-100 m-0 p-0 overflow-y-auto bg-white" >
  <Header />

  {/* Main wrapper: Houses Sidebar and Content side-by-side */}
  <div className="d-flex flex-row flex-grow-1 w-100">
    
    {/* Sidebar */}
    <Sidebar />

    {/* Content Area */}
    <div className="d-flex flex-column flex-grow-1 bg-body-tertiary min-w-0">
      
      {/* Main Panel */}
      <main className="flex-grow-1 p-3 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
      
    </div>
  </div>

  <ToastContainer
    theme={isDarkMode ? "dark" : "light"}
    position="bottom-right"
    autoClose={3000}
  />
</div>
  );
}

import React from "react";
import { Outlet } from "react-router-dom"; // Placeholder for matching page routes
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";

function DashboardLayout() {
  const { isDarkMode } = useTheme();

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Sticky/Top Header */}
      <Header />

      {/* Main wrapper: Changes to column on mobile, row on medium screens (md) and up */}
      <div className="d-flex  flex-row flex-grow-1">
        {/* Sidebar: Make sure your Sidebar component handles hiding/toggling or stacking on mobile */}
        <Sidebar />

        {/* Content Area: Stretches to fill space, houses both main content and footer vertically */}
        <div className="d-flex flex-column flex-grow-1 bg-body-tertiary">
          {/* Main Panel: Scrollable independently if content overflows */}
          <main className="flex-grow-1 p-3">
            <Outlet />
          </main>

          {/* Footer: Sits cleanly at the bottom of the content stream */}
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

export default DashboardLayout;

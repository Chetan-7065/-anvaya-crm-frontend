import React from 'react';
import { Outlet } from 'react-router-dom'; // Placeholder for matching page routes
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useTheme } from "../context/ThemeContext";

function DashboardLayout() {
  const {isDarkMode} = useTheme()

  return (
    <div className="vh-100 d-flex flex-column overflow-hidden">
      <Header />

      <div className="d-flex flex-grow-1 overflow-hidden">
        
        <Sidebar />
        <main className="flex-grow-1 p-3 overflow-y-auto bg-body-tertiary">
          
          <Outlet />

        </main>
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
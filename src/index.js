import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home';
import LeadsManagement from './pages/LeadsManagement';
import LeadsList from "./pages/LeadsList"
import AddNewLead from './pages/AddNewLead';
import SalesAgentManagement from './pages/SalesAgentManagement';
import AddNewSalesAgent from './pages/AddNewSalesAgent';
import LeadsByStatus from './pages/LeadsByStatus'
import LeadsBySalesAgent from './pages/LeadsBySalesAgent';
import Report from './pages/Report';
import { ToastContainer} from 'react-toastify';
import Setting from './pages/setting';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './pages/DashboardLayout';
// import Home from './pages/Home';


const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
    {
    path: "/",
    element: <Home/>
  },
    {
    path: "/leadsManagement/:leadId",
    element: <LeadsManagement/>
  },
  {
    path: "/leads",
    element: <LeadsList/>
  },
  {
    path: "/addNewLead",
    element: <AddNewLead/>
  },
  {
    path: "/salesAgentManagement",
    element: <SalesAgentManagement/>
  },
  {
    path: "/addNewSalesAgent",
    element: <AddNewSalesAgent/>
  },
  {
    path: "/leadsByStatus/:status",
    element: <LeadsByStatus/>
  },
  {
    path: "/leadsBySalesAgent/:agentId",
    element: <LeadsBySalesAgent/>
  },
  {
    path: "/setting",
    element: <Setting/>
  },
  {
    path: "/report",
    element: <Report/>
  },
    ]
  }
])  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
    <RouterProvider element={DashboardLayout} router={router} />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

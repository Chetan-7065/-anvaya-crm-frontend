import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  let location = useLocation();
  return (
    <>
    <main className="sidebar">
  <div className="d-flex align-items-stretch min-vh-100">
    <div
      className="d-flex flex-column flex-shrink-0 p-2 p-sm-3 text-white position-sticky top-0"
      style={{ 
        width: "100%", 
        maxWidth: "400px", 
        minWidth: "70px",
        backgroundColor: "#1D3758", 
        height: "100vh"
      }}
    >
      {/* Sidebar Header */}
      <Link
        href="/"
        className="d-flex align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <i className="bi bi-speedometer2 fs-4 me-0 me-md-2"></i>
        <span className="fs-4 d-none d-md-inline">Dashboard</span>
      </Link>
      <hr />

      {/* Primary Navigation - Visible on Root Route */}
      <ul
        className="nav nav-pills flex-column mb-auto align-items-center align-items-md-start"
        style={{ display: location.pathname === "/" ? "flex" : "none" }}
      >
        <li className="nav-item w-100 text-center text-md-start">
          <Link
            to={"/leads"}
            className="nav-link text-white px-2 px-md-3"
            aria-current="page"
          >
            <i className="bi bi-person-plus fs-5 me-0 me-md-2"></i>
            <span className="d-none d-md-inline">Leads</span>
          </Link>
        </li>
        {/* <li className="w-100 text-center text-md-start">
          <Link to={"/leads"}  className="nav-link text-white px-2 px-md-3">
            <i className="bi bi-graph-up fs-5 me-0 me-md-2"></i>
            <span className="d-none d-md-inline">Sales</span>
          </Link>
        </li> */}
        <li className="w-100 text-center text-md-start">
          <Link to={"/salesAgentManagement"} className="nav-link text-white px-2 px-md-3">
            <i className="bi bi-people fs-5 me-0 me-md-2"></i>
            <span className="d-none d-md-inline">Agents</span>
          </Link>
        </li>
        <li className="w-100 text-center text-md-start">
          <Link to={"/report"} className="nav-link text-white px-2 px-md-3">
            <i className="bi bi-file-earmark-bar-graph fs-5 me-0 me-md-2"></i>
            <span className="d-none d-md-inline">Reports</span>
          </Link>
        </li>
        <li className="w-100 text-center text-md-start">
          <Link to={"/setting"} className="nav-link text-white px-2 px-md-3">
            <i className="bi bi-gear fs-5 me-0 me-md-2"></i>
            <span className="d-none d-md-inline">Settings</span>
          </Link>
        </li>
      </ul>

      {/* Secondary Navigation - Visible on Sub-Routes */}
      <ul
        className="nav nav-pills flex-column mb-auto align-items-center align-items-md-start"
        style={{ display: location.pathname !== "/" ? "flex" : "none" }}
      >
        <li className="w-100 text-center text-md-start">
          <Link to={"/"} className="nav-link text-white px-2 px-md-3">
            <i className="bi bi-arrow-left-short fs-4 me-0 me-md-2"></i>
            <span className="d-none d-md-inline">Back to Dashboard</span>
          </Link>
        </li>
      </ul>

      <style>{`
        .style-rectangle-btn { border-radius: 0px !important; }
        @media (max-width: 767.98px) {
          div.flex-shrink-0 { width: 70px !important; }
        }
      `}</style>
    </div>
  </div>
   </main>
</>
 
  );
}

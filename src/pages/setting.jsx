import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import useFetch from "../useFetch";
import { toast } from "react-toastify";
import axios from "axios";

export default function Setting() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const { data, loading, error, refetch } = useFetch(
    "https://anvaya-crm-backend-puce.vercel.app/leads",
  );

  const {
    data: agentsData,
    loading: agentsLoading,
    error: agentsError,
    refetch: agentsRefetch,
  } = useFetch("https://anvaya-crm-backend-puce.vercel.app/agents");

  useEffect(() => {
    if (data && data.length > 0) {
      setLeads(data);
    }

    if (agentsData && agentsData.length > 0) {
      setAgents(agentsData);
    }
  }, [data, agentsData]);

  // Handler for Lead Form Submit
  const handleLeadDelete = async (leadId) => {
    try {
      const response = await axios.delete(
        `https://anvaya-crm-backend-puce.vercel.app/leads/${leadId}`,
      );
      toast.success("Lead record deleted successfully");
      refetch();
    } catch (error) {
      if (error.response) {
        console.log("Status: ", error.response.status);
        console.log("Data: ", error.response.data);
      } else if (error.request) {
        console.log("Network error: Is the backend running?");
      } else {
        console.log("Setup Error: ", error.message);
      }
    }
  };

  // Handler for Sales Agent Form Submit
  const handleAgentDelete = async (agentId) => {
    try {
      const response = await axios.delete(
        `https://anvaya-crm-backend-puce.vercel.app/agents/${agentId}`,
      );
      toast.success("Agent account deleted successfully");
      agentsRefetch();
    } catch (error) {
      if (error.response) {
        console.log("Status: ", error.response.status);
        console.log("Data: ", error.response.data);
      } else if (error.request) {
        console.log("Network error: Is the backend running?");
      } else {
        console.log("Setup Error: ", error.message);
      }
    }
  };

  function downloadCSV(data) {
    if (data.length === 0) return;

    // 1. Extract headers (keys from the first object)
    const headers = Object.keys(data[0]).join(",");

    // 2. Map data rows
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`) // Wrap in quotes to handle commas inside text
        .join(","),
    );

    // 3. Combine header and rows
    const csvContent = [headers, ...rows].join("\n");

    // 4. Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "crm_leads_export.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleExportCSV = () => {
    downloadCSV(leads);
  };
  return (
    <>
      <main className="container-fluid px-1 px-sm-3">
        <style>{`
    @media (max-width: 575.98px) {
      .iphone-xr-layout-root {
        max-width: 300px !important;
        padding: 0.5rem !important;
        margin: 0 auto !important; /* Keep it centered on mobile */
      }
      .iphone-xr-card-wrapper {
        max-width: 100% !important;
        width: 100% !important;
      }
    }
      .style-rectangle, 
          .style-rectangle-input, 
          .btn-rect {
            border-radius: 0px !important;
          }
          .btn-rect {
            font-weight: 500;
            letter-spacing: 0.3px;
            padding: 0.25rem 1rem;
          }
          .style-rectangle-input:focus {
            border-color: #0d6efd;
            box-shadow: none;
          }
  `}</style>

        {/* Left-aligned layout for desktop view */}
        <div className="row justify-content-center justify-content-md-start">
          <div className="col-12 col-xl-12 d-flex justify-content-center justify-content-md-start">
            <div
              className={`m-2 iphone-xr-layout-root w-100 ${isDarkMode ? "bg-dark text-light p-2 p-sm-4" : ""}`}
              style={{
                maxWidth: "1200px",
                margin:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "0 auto"
                    : "0",
              }}
            >
              {/* Component Header Panel */}
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between border-bottom pb-2 pb-sm-3 mb-3 mb-sm-4 gap-1 gap-sm-2">
                <h2
                  className="fw-bold m-0 h3"
                  style={{ fontSize: "calc(1.1rem + 0.5vw)" }}
                >
                  <i className="bi bi-gear-fill me-2 text-primary"></i>CRM
                  Settings
                </h2>
                <span
                  className="text-muted small"
                  style={{ fontSize: "0.75rem" }}
                >
                  Application Configuration
                </span>
              </div>

              <div>
                {/* Grid Layout: Balanced side-by-side display setup via col-md-6 */}
                <div className="row g-3 g-sm-4 mb-3 mb-sm-4 justify-content-center justify-content-md-start">
                  {/* 1. Leads List Section */}
                  <div className="col-12 col-md-6 iphone-xr-card-wrapper">
                    <section className="card h-100 shadow-sm border-0">
                      <header className="card-header bg-white py-1 py-sm-2 border-bottom-0">
                        <h2
                          className="text-dark mb-0 fw-semibold"
                          style={{ fontSize: "calc(0.85rem + 0.4vw)" }}
                        >
                          <span
                            className="d-md-none"
                            style={{ fontSize: "0.82rem" }}
                          >
                            Lead Management Control
                          </span>
                          <span
                            className="d-none d-md-inline"
                            style={{ fontSize: "1.25rem" }}
                          >
                            Lead Management Control
                          </span>
                        </h2>
                      </header>

                      <div className="card-body p-2 p-sm-3">
                        <h3
                          className="text-danger mb-1 fw-medium"
                          style={{ fontSize: "calc(0.78rem + 0.2vw)" }}
                        >
                          <span
                            className="d-md-none"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Leads Directory
                          </span>
                          <span
                            className="d-none d-md-inline"
                            style={{ fontSize: "1rem" }}
                          >
                            Leads Directory
                          </span>
                        </h3>

                        <p className="text-muted mb-2 mb-sm-3">
                          <span
                            className="d-md-none"
                            style={{
                              fontSize: "0.68rem",
                              lineHeight: "1.2",
                              display: "block",
                            }}
                          >
                            Review existing records. Use the action button to
                            remove a lead from the system.
                          </span>
                          <span
                            className="d-none d-md-inline"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Review existing records. Use the action button to
                            remove a lead from the system.
                          </span>
                        </p>

                        <ul
                          className="list-group list-group-flush lead-list-scroll"
                          style={{ overflowY: "auto" }}
                        >
                          <style>{`
                      .lead-list-scroll { max-height: 240px; }
                      @media (min-width: 768px) { .lead-list-scroll { max-height: 400px; } }
                    `}</style>
                          {leads && leads.length > 0 ? (
                            leads.map((lead) => {
                              return (
                                <li
                                  key={lead.id}
                                  className="list-group-item px-0 py-1 py-md-2 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between"
                                >
                                  <div className="fw-semibold text-dark text-truncate ps-1 w-100 w-md-25 name-col-width">
                                    <style>{`
                                .name-col-width { min-width: auto; }
                                @media (min-width: 768px) { .name-col-width { min-width: 120px; } }
                              `}</style>
                                    <span
                                      className="d-md-none"
                                      style={{ fontSize: "0.75rem" }}
                                    >
                                      {lead.name}
                                    </span>
                                    <span
                                      className="d-none d-md-inline"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      {lead.name}
                                    </span>
                                  </div>

                                  <div
                                    className="text-muted text-start text-md-center text-truncate w-100 w-md-auto flex-grow-1 px-1 px-md-2 mt-0"
                                    style={{ order: 2 }}
                                  >
                                    <span
                                      className="d-md-none text-muted"
                                      style={{ fontSize: "0.65rem" }}
                                    >
                                      {lead.status}
                                    </span>
                                    <span
                                      className="d-none d-md-inline"
                                      style={{ fontSize: "0.75rem" }}
                                    >
                                      {lead.status}
                                    </span>
                                  </div>

                                  <div
                                    className="text-start text-md-end pe-1 w-100 w-md-20 mt-1 mt-md-0 btn-col-width"
                                    style={{ order: 3 }}
                                  >
                                    <style>{`
                                .btn-col-width { min-width: auto; }
                                @media (min-width: 768px) { .btn-col-width { min-width: 70px; } }
                              `}</style>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm py-0 py-md-1 px-2 w-100 delete-btn-sizing"
                                      onClick={() => handleLeadDelete(lead._id)}
                                    >
                                      <style>{`
                                  .delete-btn-sizing { max-height: 22px; max-width: 60px; line-height: 1.1; }
                                  @media (min-width: 768px) { .delete-btn-sizing { max-height: none; max-width: 120px; line-height: inherit; } }
                                `}</style>
                                      <span
                                        className="d-md-none"
                                        style={{ fontSize: "0.62rem" }}
                                      >
                                        Delete
                                      </span>
                                      <span
                                        className="d-none d-md-inline"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        Delete
                                      </span>
                                    </button>
                                  </div>
                                </li>
                              );
                            })
                          ) : (
                            <li
                              className="list-group-item text-muted small px-0 py-2"
                              style={{ fontSize: "0.7rem" }}
                            >
                              No leads available.
                            </li>
                          )}
                        </ul>
                      </div>
                    </section>
                  </div>

                  {/* 2. Sales Agent List Section (NOW MATCHES LEADS LIST EXACTLY) */}
                  <div className="col-12 col-md-6 iphone-xr-card-wrapper">
                    <section className="card h-100 shadow-sm border-0">
                      <header className="card-header bg-white py-1 py-sm-2 border-bottom-0">
                        <h2
                          className="text-dark mb-0 fw-semibold"
                          style={{ fontSize: "calc(0.85rem + 0.4vw)" }}
                        >
                          <span
                            className="d-md-none"
                            style={{ fontSize: "0.82rem" }}
                          >
                            Agent Access Management
                          </span>
                          <span
                            className="d-none d-md-inline"
                            style={{ fontSize: "1.25rem" }}
                          >
                            Agent Access Management
                          </span>
                        </h2>
                      </header>

                      <div className="card-body p-2 p-sm-3">
                        <h3
                          className="text-danger mb-1 fw-medium"
                          style={{ fontSize: "calc(0.78rem + 0.2vw)" }}
                        >
                          <span
                            className="d-md-none"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Active Sales Agents
                          </span>
                          <span
                            className="d-none d-md-inline"
                            style={{ fontSize: "1rem" }}
                          >
                            Active Sales Agents
                          </span>
                        </h3>
                        <p className="text-muted mb-2 mb-sm-3">
                          <span
                            className="d-md-none"
                            style={{
                              fontSize: "0.68rem",
                              lineHeight: "1.2",
                              display: "block",
                            }}
                          >
                            Warning: Removing an agent will restrict system
                            login permissions immediately.
                          </span>
                          <span
                            className="d-none d-md-inline"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Warning: Removing an agent will restrict system
                            login permissions immediately.
                          </span>
                        </p>

                        <ul
                          className="list-group list-group-flush agent-list-scroll"
                          style={{ overflowY: "auto" }}
                        >
                          <style>{`
                      .agent-list-scroll { max-height: 240px; }
                      @media (min-width: 768px) { .agent-list-scroll { max-height: 400px; } }
                    `}</style>
                          {agents && agents.length > 0 ? (
                            agents.map((agent) => (
                              <li
                                key={agent._id}
                                className="list-group-item px-0 py-1 py-md-2 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between"
                              >
                                {/* Structured Agent Name Column Grid Segment */}
                                <div className="fw-semibold text-dark text-truncate ps-1 w-100 w-md-25 agent-name-width">
                                  <style>{`
                              .agent-name-width { min-width: auto; }
                              @media (min-width: 768px) { .agent-name-width { min-width: 120px; } }
                            `}</style>
                                  <span
                                    className="d-md-none"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    {agent.name}
                                  </span>
                                  <span
                                    className="d-none d-md-inline"
                                    style={{ fontSize: "0.875rem" }}
                                  >
                                    {agent.name}
                                  </span>
                                </div>

                                {/* Structured Agent Email Column Grid Segment */}
                                <div
                                  className="text-muted text-start text-md-center text-truncate w-100 w-md-auto flex-grow-1 px-1 px-md-2 mt-0"
                                  style={{ order: 2 }}
                                >
                                  <span
                                    className="d-md-none text-muted"
                                    style={{ fontSize: "0.65rem" }}
                                  >
                                    {agent.email}
                                  </span>
                                  <span
                                    className="d-none d-md-inline"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    {agent.email}
                                  </span>
                                </div>

                                {/* Structured Agent Delete Button Column Grid Segment */}
                                <div
                                  className="text-start text-md-end pe-1 w-100 w-md-20 mt-1 mt-md-0 agent-btn-width"
                                  style={{ order: 3 }}
                                >
                                  <style>{`
                              .agent-btn-width { min-width: auto; }
                              @media (min-width: 768px) { .agent-btn-width { min-width: 70px; } }
                            `}</style>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm py-0 py-md-1 px-2 w-100 agent-delete-sizing"
                                    onClick={() => handleAgentDelete(agent._id)}
                                  >
                                    <style>{`
                                .agent-delete-sizing { max-height: 22px; max-width: 60px; line-height: 1.1; }
                                @media (min-width: 768px) { .agent-delete-sizing { max-height: none; max-width: 120px; line-height: inherit; } }
                              `}</style>
                                    <span
                                      className="d-md-none"
                                      style={{ fontSize: "0.62rem" }}
                                    >
                                      Delete
                                    </span>
                                    <span
                                      className="d-none d-md-inline"
                                      style={{ fontSize: "0.75rem" }}
                                    >
                                      Delete
                                    </span>
                                  </button>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li
                              className="list-group-item text-muted small px-0 py-2"
                              style={{ fontSize: "0.7rem" }}
                            >
                              No agents registered.
                            </li>
                          )}
                        </ul>
                      </div>
                    </section>
                  </div>
                </div>

                {/* System Preferences Block */}
                <div className="card mb-4 style-rectangle shadow-sm">
                  <div
                    className="card-header bg-transparent border-secondary fw-semibold py-2 py-sm-3"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <i className="bi bi-sliders me-2 text-primary"></i>System
                    Preferences
                  </div>
                  <div className="card-body p-2 p-sm-4">
                    <div className="form-check form-switch mb-3 mb-sm-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="darkModeToggle"
                        checked={isDarkMode}
                        onChange={() => toggleDarkMode(!isDarkMode)}
                      />
                      <label
                        className="form-check-input-label fw-medium"
                        htmlFor="darkModeToggle"
                        style={{ fontSize: "0.8rem" }}
                      >
                        <i
                          className={`bi ${isDarkMode ? "bi-moon-fill" : "bi-sun-fill"} me-2`}
                        ></i>
                        Enable Dark Mode Workspace
                      </label>
                    </div>

                    <hr className="border-secondary my-3 my-sm-4" />
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 py-1">
                      <div className="pe-sm-3">
                        <h6
                          className="mb-1 fw-bold"
                          style={{ fontSize: "0.85rem" }}
                        >
                          Backup & Data Portability
                        </h6>
                        <span
                          className="text-muted small mb-0"
                          style={{
                            fontSize: "0.68rem",
                            display: "block",
                            lineHeight: "1.2",
                            display: "block",
                          }}
                        >
                          Download all your current lead records into a clean,
                          flat CSV file spreadsheet.
                        </span>
                      </div>
                      <button
                        onClick={handleExportCSV}
                        className="btn btn-dark btn-sm btn-rect w-sm-auto mt-1 mt-sm-0"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <i className="bi bi-download me-2"></i>Export Leads
                        (CSV)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

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
      <main className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            <div
              className={`m-2 ${isDarkMode ? "bg-dark text-light p-4" : ""}`}
              style={{ maxWidth: "1200px", margin: "0 auto" }}
            >
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between border-bottom pb-3 mb-4 gap-2">
                <h2 className="fw-bold m-0 h3">
                  <i className="bi bi-gear-fill me-2 text-primary"></i>CRM
                  Settings
                </h2>
                <span className="text-muted small">
                  Application Configuration
                </span>
              </div>

              <div>
                <div className="row g-4 mb-4">
                  {/* Leads List Section */}
                  <div className="col-12 col-md-6"  >
                    <section className="card h-100 shadow-sm">
                      <header className="card-header bg-white py-2">
                        <h2 className="h5 text-dark mb-0 fw-semibold">
                          Lead Management Control
                        </h2>
                      </header>

                      <div className="card-body p-3">
                        <h3 className="h6 text-danger mb-1 fw-medium">
                          Leads Directory
                        </h3>
                        <p
                          className="text-muted small mb-3"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Review existing records. Use the action button to
                          remove a lead from the system.
                        </p>

                        <ul className="list-group list-group-flush" style={{maxHeight: "400px", overflowY: "auto"}}>
                          {leads && leads.length > 0 ? (
                            leads.map((lead) => (
                              <li
                                key={lead.id}
                                className="list-group-item px-0 py-2 d-flex align-items-center justify-content-between"
                              >
                                
                                <div
                                  className="fw-semibold text-dark small text-truncate ps-2"
                                  style={{ width: "25%" }}
                                >
                                  {lead.name}
                                </div>

                                <div
                                  className="text-muted text-center text-truncate small flex-grow-1 px-2"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                    {lead.status}
                                </div>

                                <div
                                  className="text-end pe-2"
                                  style={{ width: "20%", minWidth: "70px" }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm py-1 px-2 w-100"
                                    style={{ fontSize: "0.75rem" }}
                                    onClick={() => handleLeadDelete(lead._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="list-group-item text-muted small px-0 py-2">
                              No leads available.
                            </li>
                          )}
                        </ul>
                      </div>
                    </section>
                  </div>

                  {/* Sales Agent List Section */}
                  <div className="col-12 col-md-6">
                    <section className="card h-100 shadow-sm">
                      <header className="card-header bg-white py-2">
                        <h2 className="h5 text-dark mb-0 fw-semibold">
                          Agent Access Management
                        </h2>
                      </header>

                      <div className="card-body p-3">
                        <h3 className="h6 text-danger mb-1 fw-medium ">
                          Active Sales Agents
                        </h3>
                        <p
                          className="text-muted small mb-3"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Warning: Removing an agent will restrict system login
                          permissions immediately.
                        </p>

                        <ul className="list-group list-group-flush"  style={{maxHeight: "400px", overflowY: "auto"}}>
                          {agents && agents.length > 0 ? (
                            agents.map((agent) => (
                             <li
                                key={agent._id}
                                className="list-group-item px-0 py-2 d-flex align-items-center justify-content-between"
                              >
                                
                                <div
                                  className="fw-semibold text-dark small text-truncate ps-2"
                                  style={{ width: "25%" }}
                                >
                                  {agent.name}
                                </div>

                                <div
                                  className="text-muted text-center text-truncate small flex-grow-1 px-2"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {agent.email}
                                </div>

                                {/* 3. End: Delete Button */}
                                <div
                                  className="text-end pe-2"
                                  style={{ width: "20%", minWidth: "70px" }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm py-1 px-2 w-100"
                                    style={{ fontSize: "0.75rem" }}
                                    onClick={() => handleLeadDelete(agent._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="list-group-item text-muted small px-0 py-2">
                              No agents registered.
                            </li>
                          )}
                        </ul>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="card mb-4 style-rectangle shadow-sm">
                  <div className="card-header bg-transparent border-secondary fw-semibold py-3">
                    <i className="bi bi-sliders me-2 text-primary"></i>System
                    Preferences
                  </div>
                  <div className="card-body p-3 p-sm-4">
                    <div className="form-check form-switch mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="darkModeToggle"
                        checked={isDarkMode}
                        onChange={() => toggleDarkMode(!isDarkMode)}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor="darkModeToggle"
                      >
                        <i
                          className={`bi ${isDarkMode ? "bi-moon-fill" : "bi-sun-fill"} me-2`}
                        ></i>
                        Enable Dark Mode Workspace
                      </label>
                    </div>

                    <hr className="border-secondary my-4" />
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 py-2">
                      <div className="pe-sm-3">
                        <h6 className="mb-1 fw-bold">
                          Backup & Data Portability
                        </h6>
                        <p className="text-muted small mb-0">
                          Download all your current lead records into a clean,
                          flat CSV file spreadsheet.
                        </p>
                      </div>
                      <button
                        onClick={handleExportCSV}
                        className="btn btn-dark btn-sm btn-rect w-80 w-sm-auto mt-2 mt-sm-0"
                      >
                        <i className="bi bi-download me-2"></i>Export Leads
                        (CSV)
                      </button>
                    </div>
                  </div>
                </div>

                <style>{`
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

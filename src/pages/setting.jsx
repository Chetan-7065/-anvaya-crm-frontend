import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import useFetch from "../useFetch";

export default function Setting() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [leads, setLeads] = useState([]);
  const { data, loading, error } = useFetch(
    "https://anvaya-crm-backend-puce.vercel.app/leads",
  );


  useEffect(() => {
    if (data && data.length > 0) {
      setLeads(data);
    }
  }, [data]);
const [leadName, setLeadName] = useState("");
  const [salesAgentName, setSalesAgentName] = useState("");

  // --- Section 2: Sales Agent Management State ---
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");

  // Handler for Lead Form Submit
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    
    const leadPayload = {
      lead: leadName,
      salesAgent: salesAgentName,
    };

    console.log("Deleted Lead Payload Object:", leadPayload);
    alert("Lead Form Object Sample:\n" + JSON.stringify(leadPayload, null, 2));
  };

  // Handler for Sales Agent Form Submit
  const handleAgentSubmit = (e) => {
    e.preventDefault();

    // The precise object layout requested for the agent
    const agentPayload = {
      name: agentName,
      email: agentEmail,
    };

    console.log("Deleted Agent Payload Object:", agentPayload);
    alert("Agent Form Object Sample:\n" + JSON.stringify(agentPayload, null, 2));
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
    <div className="row ">
      <div className="col-12 col-xl-10">
        <div
          className={`m-2 ${isDarkMode ? "bg-dark text-light p-4" : ""}`}
          style={{ maxWidth: "800px" }}
        >
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between border-bottom pb-3 mb-4 gap-2">
            <h2 className="fw-bold m-0 h3">
              <i className="bi bi-gear-fill me-2 text-primary"></i>CRM Settings
            </h2>
            <span className="text-muted small">
              Application Configuration
            </span>
          </div>

          <div className="mx-auto" style={{ maxWidth: "800px" }}>
        
        
        {/* SECTION 1: LEAD MANAGEMENT CONTRTOL                       */}

        <section className="card shadow-sm mb-4">
          <header className="card-header bg-white py-3">
            <h2 className="h4 text-dark mb-0 fw-semibold">Lead Management Control</h2>
          </header>

          <div className="card-body p-4">
            <h3 className="h5 text-danger mb-1 fw-medium">Delete Lead</h3>
            <p className="text-muted small mb-4">
              Warning: Proceed with caution. Input details precisely to execute removal operations.
            </p>

            <form onSubmit={handleLeadSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label htmlFor="leadInput" className="form-label small fw-medium text-secondary">
                    Lead Name
                  </label>
                  <input
                    id="leadInput"
                    type="text"
                    className="form-control"
                    placeholder="Enter Lead Name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="agentInput" className="form-label small fw-medium text-secondary">
                    Sales Agent Name
                  </label>
                  <input
                    id="agentInput"
                    type="text"
                    className="form-control"
                    placeholder="Enter Sales Agent Name"
                    value={salesAgentName}
                    onChange={(e) => setSalesAgentName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-danger px-4 fw-medium">
                  Delete Lead Record
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 2: SALES AGENT CONTRTOL (NEW)                     */}
      
        <section className="card shadow-sm mb-4">
          <header className="card-header bg-white py-3">
            <h2 className="h4 text-dark mb-0 fw-semibold">Agent Access Management</h2>
          </header>

          <div className="card-body p-4">
            <h3 className="h5 text-danger mb-1 fw-medium">Delete Sales Agent</h3>
            <p className="text-muted small mb-4">
              Warning: Removing an agent will restrict system login permissions. Enter exact verified credentials.
            </p>

            <form onSubmit={handleAgentSubmit}>
              <div className="row g-3 mb-4">
                
                {/* Input 1: Agent Name */}
                <div className="col-md-6">
                  <label htmlFor="salesAgentProfileName" className="form-label small fw-medium text-secondary">
                    Agent Name
                  </label>
                  <input
                    id="salesAgentProfileName"
                    type="text"
                    className="form-control"
                    placeholder="Enter Agent Full Name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    required
                  />
                </div>

                {/* Input 2: Agent Email (with built-in validation format) */}
                <div className="col-md-6">
                  <label htmlFor="salesAgentEmail" className="form-label small fw-medium text-secondary">
                    Agent Email Address
                  </label>
                  <input
                    id="salesAgentEmail"
                    type="email" // Automatically blocks non-email configurations like names/numbers
                    className="form-control"
                    placeholder="example@company.com"
                    value={agentEmail}
                    onChange={(e) => setAgentEmail(e.target.value)}
                    required
                  />
                  <div className="form-text text-muted small">Must be a valid email structure.</div>
                </div>

              </div>

              {/* Delete Agent Action button */}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-danger px-4 fw-medium">
                  Delete Agent Account
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

          {/* SECTION 1: SYSTEM PREFERENCES & UTILITIES */}
          <div className="card  mb-4 style-rectangle shadow-sm">
            <div className="card-header bg-transparent border-secondary fw-semibold py-3">
              <i className="bi bi-sliders me-2 text-primary"></i>System Preferences
            </div>
            <div className="card-body p-3 p-sm-4">
              {/* Feature 1: Dark Mode Toggle */}
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
               {/* Feature 2: Download csv files */}
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
    className="btn btn-dark btn-rect flex-shrink-0  w-sm-auto mt-2 mt-sm-0"
  >
    <i className="bi bi-download me-2"></i>Export Leads (CSV)
  </button>
</div>
            </div>
          </div>

          <style>{`
            /* Forces sharp rectangular edges on Bootstrap components */
            .style-rectangle, 
            .style-rectangle-input, 
            .btn-rect {
              border-radius: 0px !important;
            }
            
            /* Adds layout polish to the rectangular primary action buttons */
            .btn-rect {
              font-weight: 500;
              letter-spacing: 0.3px;
              padding: 0.5rem 1.25rem;
            }

            /* Input styling to match the sharp aesthetic */
            .style-rectangle-input:focus {
              border-color: #0d6efd;
              box-shadow: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  </main>
</>
  );
}

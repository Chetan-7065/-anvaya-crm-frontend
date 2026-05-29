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
  const { data, loading, error } = useFetch(
    "https://anvaya-crm-backend-puce.vercel.app/leads",
  );

  const {
      data: agentsData,
      loading: agentsLoading,
      error: agentsError,
    } = useFetch("https://anvaya-crm-backend-puce.vercel.app/agents");


  useEffect(() => {
    if (data && data.length > 0) {
      setLeads(data);
    }

     if (agentsData && agentsData.length > 0) {
      setAgents(agentsData);
    }
  }, [data, agentsData]);

const [leadName, setLeadName] = useState("");
  const [salesAgentName, setSalesAgentName] = useState("");

  
  const [agentName, setAgentName] = useState("");
  const [agentEmail, setAgentEmail] = useState("");

  // Handler for Lead Form Submit
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    
    const leadPayload = {
      lead: leadName,
      salesAgent: salesAgentName,
    };

    const leadDetails = leads.find((lead) => lead.name.toLowerCase() === leadName.trim().toLowerCase() && lead.salesAgent.name.toLowerCase() === salesAgentName.trim().toLowerCase() )
    console.log(leads)
    console.log(leadDetails)
    if(!leadDetails){
      toast.error("Please check the lead Name and sales agent")
    }
    console.log("Deleted Lead Payload Object:", leadPayload);
    setLeadName("")
    setSalesAgentName("")
    
     try {
          const response = await axios.delete(
            `https://anvaya-crm-backend-puce.vercel.app/leads/${leadDetails._id}`,
          );
          toast.success("Lead record deleted successfully");
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
  const handleAgentSubmit = async (e) => {
    e.preventDefault();

    const agentPayload = {
      name: agentName,
      email: agentEmail,
    };

    const agentDetails = agents.find((agent) => agent.name.toLowerCase() === agentName.trim().toLocaleLowerCase() && agent.email === agentEmail.trim() )
    console.log(agents)
    console.log(agentDetails)
    if(!agentDetails){
      toast.error("Please check the Name and Email")
    }
    
    console.log("Deleted Agent Payload Object:", agentPayload);

    setAgentName("")
    setAgentEmail("")
    
     try {
          const response = await axios.delete(
            `https://anvaya-crm-backend-puce.vercel.app/agents/${agentDetails._id}`,
          );
          toast.success("Agent account deleted successfully");
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
            <i className="bi bi-gear-fill me-2 text-primary"></i>CRM Settings
          </h2>
          <span className="text-muted small">
            Application Configuration
          </span>
        </div>

        <div>
          <div className="row g-4 mb-4">
            
            <div className="col-12 col-md-6">
              <section className="card h-100 shadow-sm">
                <header className="card-header bg-white py-2">
                  <h2 className="h5 text-dark mb-0 fw-semibold">Lead Management Control</h2>
                </header>

                <div className="card-body p-3">
                  <h3 className="h6 text-danger mb-1 fw-medium">Delete Lead</h3>
                  <p className="text-muted small mb-3" style={{ fontSize: "0.8rem" }}>
                    Warning: Proceed with caution. Input details precisely to execute removal operations.
                  </p>

                  <form onSubmit={handleLeadSubmit}>
                    <div className="row g-2 mb-3">
                      <div className="col-12">
                        <label htmlFor="leadInput" className="form-label small fw-medium text-secondary mb-1" style={{ fontSize: "0.75rem" }}>
                          Lead Name
                        </label>
                        <input
                          id="leadInput"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Enter Lead Name"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="agentInput" className="form-label small fw-medium text-secondary mb-1" style={{ fontSize: "0.75rem" }}>
                          Sales Agent Name
                        </label>
                        <input
                          id="agentInput"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Enter Sales Agent Name"
                          value={salesAgentName}
                          onChange={(e) => setSalesAgentName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-danger btn-sm px-3 fw-medium mt-3 ">
                        Delete Lead Record
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>

            <div className="col-12 col-md-6">
              <section className="card h-100 shadow-sm">
                <header className="card-header bg-white py-2">
                  <h2 className="h5 text-dark mb-0 fw-semibold">Agent Access Management</h2>
                </header>

                <div className="card-body p-3">
                  <h3 className="h6 text-danger mb-1 fw-medium">Delete Sales Agent</h3>
                  <p className="text-muted small mb-3" style={{ fontSize: "0.8rem" }}>
                    Warning: Removing an agent will restrict system login permissions.
                  </p>

                  <form onSubmit={handleAgentSubmit}>
                    <div className="row g-2 mb-3">
                      <div className="col-12">
                        <label htmlFor="salesAgentProfileName" className="form-label small fw-medium text-secondary mb-1" style={{ fontSize: "0.75rem" }}>
                          Agent Name
                        </label>
                        <input
                          id="salesAgentProfileName"
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Enter Agent Full Name"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="salesAgentEmail" className="form-label small fw-medium text-secondary mb-1" style={{ fontSize: "0.75rem" }}>
                          Agent Email Address
                        </label>
                        <input
                          id="salesAgentEmail"
                          type="email"
                          className="form-control form-control-sm"
                          placeholder="example@company.com"
                          value={agentEmail}
                          onChange={(e) => setAgentEmail(e.target.value)}
                          required
                        />
                        <div className="text-muted" style={{ fontSize: "0.7rem", marginTop: "2px" }}>Must be a valid email structure.</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-danger btn-sm px-3 fw-medium ">
                        Delete Agent Account
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>

          </div>


          <div className="card mb-4 style-rectangle shadow-sm">
            <div className="card-header bg-transparent border-secondary fw-semibold py-3">
              <i className="bi bi-sliders me-2 text-primary"></i>System Preferences
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
                  <i className={`bi ${isDarkMode ? "bi-moon-fill" : "bi-sun-fill"} me-2`}></i>
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
                    Download all your current lead records into a clean, flat CSV file spreadsheet.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="btn btn-dark btn-sm btn-rect w-80 w-sm-auto mt-2 mt-sm-0"
                >
                  <i className="bi bi-download me-2"></i>Export Leads (CSV)
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

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import { useToastLoader } from "../components/useToastLoader";

export const statusColorArray = [
  {
    label: "New",
    color: "#0dcaf0",
  },
  {
    label: "Contacted",
    color: "#0d6efd",
  },
  {
    label: "Closed",
    color: "#198754",
  },
  {
    label: "Proposal Sent",
    color: "#ffc107",
  },
  {
    label: "Qualified",
    color: "#dc3545",
  },
];

export default function Home() {
  const { data, loading, error } = useFetch(
    "https://anvaya-crm-backend-puce.vercel.app/leads",
  );
  const [leads, setLeads] = useState([]);
  const [displayLeads, setDisplayLeads] = useState([]);
  const [isPressed, setIsPressed] = useState("New");
  const { hasFetched } = useToastLoader(loading, error, data, {
    loading: "loading leads details...",
    error: "Failed to load leads details",
  });
  useEffect(() => {
    if (data && data.length > 0) {
      setLeads(data);
      setDisplayLeads(data.filter((lead, index) => index < 3));
    }
  }, [data]);
  const newLeads = leads.filter((lead) => lead.status === "New");
  const contactedLeads = leads.filter((lead) => lead.status === "Contacted");
  const qualifiedLeads = leads.filter((lead) => lead.status === "Qualified");
  const proposalSentLeads = leads.filter(
    (lead) => lead.status === "Proposal Sent",
  );
  const closedLeads = leads.filter((lead) => lead.status === "Closed");
  const totalLeads =
    newLeads.length +
      contactedLeads.length +
      closedLeads.length +
      proposalSentLeads.length +
      qualifiedLeads.length || 1;

  const statusArray = [
    {
      label: "New",
      count: newLeads.length,
      color: "#0dcaf0",
      icon: "bi-lightning-charge-fill",
    },
    {
      label: "Contacted",
      count: contactedLeads.length,
      color: "#0d6efd",
      icon: "bi-telephone-fill",
    },
    {
      label: "Closed",
      count: closedLeads.length,
      color: "#198754",
      icon: "bi-check-circle-fill",
    },
    {
      label: "Proposal Sent",
      count: proposalSentLeads.length,
      color: "#ffc107",
      icon: "bi-file-earmark-text-fill",
    },
    {
      label: "Qualified",
      count: qualifiedLeads.length,
      color: "#dc3545",
      icon: "bi-gem",
    },
  ];

  function handleFilter(requiredStatus) {
    const filterData = leads.filter(
      (lead, index) => lead.status === requiredStatus,
    );
    setDisplayLeads(filterData.filter((lead, index) => index < 3));
    setIsPressed(requiredStatus);
  }
  return (
    <>
  <main className="container-fluid px-0 overflow-hidden">
    <div className="row justify-content-center g-0">
      <div className="col m-2 m-sm-3" style={{ height: "calc(100vh - 70px)", overflowY: "auto" }}>
        <div
          data-bs-spy="scroll"
          data-bs-offset="0"
          data-bs-smooth-scroll="true"
          className="scrollspy-example container-fluid px-1 px-sm-3"
        >
          {/* Recent Activity Lead Section */}
          <div className="row">
            <h1 className="mb-2 h2 fw-bold">Lead Overview</h1>
            <h2 className="h4 text-secondary mb-3">Top Leads (recent Activity)</h2>
            
            {loading ? (
              <div className="text-center py-5 my-4">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="fs-4 text-secondary fw-semibold">Loading data, please wait...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5 my-4">
                <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
                <p className="fs-3 text-danger fw-bold">Oops! Something went wrong.</p>
                <p className="text-muted fs-5">{error || "Failed to fetch resource."}</p>
              </div>
            ) : displayLeads.length > 0 ? (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {displayLeads.map((lead) => {
                  return (
                    <Link
                      key={lead._id}
                      to={`/leadsManagement/${lead._id}`}
                      className="card shadow-sm text-decoration-none w-100 flex-fill"
                      style={{ maxWidth: "29rem", minWidth: "280px" }}
                    >
                      <div className="row g-0 align-items-center">
                        <div className="col-12">
                          <div className="card-body p-3">
                            <h5 className="card-title mb-1 fw-bold text-dark text-truncate" style={{ fontSize: "1.35rem" }}>
                              {lead.name}
                            </h5>
                            <p className="card-text mb-2 text-muted small">
                              Agent: <span className="text-dark fw-medium">{lead.salesAgent.name}</span>
                            </p>

                            <div className="d-flex flex-wrap gap-3 mb-2 small">
                              <p className="card-text mb-0 text-muted">
                                <span>Status:</span>{" "}
                                <span className="text-primary fw-semibold">{lead.status}</span>
                              </p>
                              <p className="card-text mb-0 text-muted">
                                <span>Priority:</span>{" "}
                                <span className="fw-semibold text-dark">{lead.priority}</span>
                              </p>
                            </div>

                            <p className="card-text mb-0 text-muted small text-truncate">
                              <i className="bi bi-tag me-1"></i>
                              {lead.tags.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5 my-4 border rounded bg-light">
                <p className="fs-4 text-muted fw-medium m-0">No data available at the moment.</p>
              </div>
            )}
          </div>

          {/* Lead Pipeline Summary Card */}
<div className="row my-4">
  <div className="col-12">
    <div className="card shadow-sm border-1 w-100" style={{ borderRadius: "16px", overflow: "hidden" }}>
      <div className="card-header bg-white pt-3 pb-3 px-3 px-sm-4 border-bottom-0">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "40px", height: "40px" }}>
            <i className="bi bi-bar-chart-line-fill text-white fs-5"></i>
          </div>
          <div className="bg-white">
            <h3 className="fw-bold  mb-0 h4" style={{ letterSpacing: "-0.5px" }}>
              Lead Status Summary
            </h3>
            <p className="text-muted mb-0 small d-none d-sm-block">
              Visual breakdown of your current sales pipeline
            </p>
          </div>
        </div>
      </div>

      <ul className="list-group list-group-flush p-2 p-sm-3 pt-0">
        {statusArray.map((item, index) => (
          <Link
            key={index}
            className="list-group-item py-2 border-0 hover-bg-light transition rounded-3 my-1"
            to={`/leadsByStatus/${item.label}`}
          >
            <div className="d-md-flex align-items-center justify-content-between row g-2 m-0">
              
              <div className="col-12 col-md-auto d-flex align-items-center justify-content-between justify-content-md-start p-0" style={{ minWidth: "220px" }}>
                <div className="d-flex align-items-center me-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: "1rem" }}></i>
                  </div>
                  <span className="fw-bold text-dark text-truncate" style={{ fontSize: "1.05rem" }}>
                    {item.label}:
                  </span>
                </div>
                
                <span className="fw-bold mb-0 me-md-3 text-end flex-shrink-0" style={{ color: item.color, fontSize: "1rem" }}>
                  {item.count} <span className="text-muted small fw-normal" style={{ fontSize: "0.85rem" }}>leads</span>
                </span>
              </div>
              
              <div className="col-12 col-md p-0 flex-grow-1">
                <div className="progress shadow-sm" style={{ height: "12px", backgroundColor: "#f0f2f5", borderRadius: "20px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${(item.count / (totalLeads || 1)) * 100}%`,
                      backgroundColor: item.color,
                      borderRadius: "20px",
                      position: "relative",
                      backgroundImage: "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
                      backgroundSize: "1rem 1rem",
                    }}
                  ></div>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </ul>
    </div>
  </div>
</div>

          {/* Action Filters and Button Bar */}
          <div className="my-4 pt-2">
            <h2 className="h4 fw-bold mb-3">Actions & Filters</h2>
            <div className="row g-3 align-items-center">
              <div className="col-12 col-xl-9 fs-5 text-dark">
                <span className="d-block d-sm-inline mb-2 mb-sm-0 fw-semibold text-muted small me-2">Quick Filters:</span>
                <div className="d-inline-flex flex-wrap gap-1">
                  {["New", "Contacted", "Closed", "Proposal Sent", "Qualified"].map((filterName) => (
                    <button
                      key={filterName}
                      onClick={() => handleFilter(filterName)}
                      className={`badge rounded-3 m-1 fs-6 px-3 py-2 border-1 text-center btn ${
                        isPressed === filterName
                          ? "bg-primary text-white"
                          : "bg-white text-primary border border-primary"
                      }`}
                    >
                      {filterName}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add Lead button */}
              <div className="col-12 col-xl-3 text-start text-xl-end">
                <Link
                  to={"/addNewLead"}
                  className="btn btn-primary d-inline-flex align-items-center justify-content-center px-4 py-2 border-0 shadow-sm w-100 w-sm-auto"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                >
                  <i className="bi bi-plus-lg me-2" style={{ fontSize: "1rem" }}></i>
                  <span>Add New Leads</span>
                </Link>
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

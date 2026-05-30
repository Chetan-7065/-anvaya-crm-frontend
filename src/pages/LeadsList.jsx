import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import useFetch from "../useFetch";
import { useEffect, useState } from "react";
import { useToastLoader } from "../components/useToastLoader";
export default function LeadsList() {
  const { data, loading, error } = useFetch(
    "https://anvaya-crm-backend-puce.vercel.app/leads",
  );
  const {
    data: agentsData,
    loading: agentsLoading,
    error: agentsError,
  } = useFetch("https://anvaya-crm-backend-puce.vercel.app/agents");
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [displayLeads, setDisplayLeads] = useState([]);
  const { hasFetched } = useToastLoader(loading, error, data, {
    loading: "loading leads details...",
    error: "Failed to load leads details",
  });
  const [filterData, setFilterData] = useState({
    status: "",
    salesAgent: "",
  });
  useEffect(() => {
    if (data && data.length > 0) {
      setLeads(data);
      setDisplayLeads(data);
    }
    if (agentsData && agentsData.length > 0) {
      setAgents(agentsData);
    }
  }, [data, agentsData]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  }
  useEffect(() => {
    if (leads.length > 0) {
      const newData = leads.filter((lead) => {
        return Object.entries(filterData).every(([key, value]) => {
          if (!value || value === "All") return true;
          if (key === "salesAgent") return lead[key]?._id === value;
          return lead[key] === value;
        });
      });
      setDisplayLeads(newData);
    }
  }, [filterData]);

  function sortByTimeToClose() {
    const sortedData = [
      ...displayLeads.sort((a, b) => a.timeToClose - b.timeToClose),
    ];
    setDisplayLeads(sortedData);
  }

  function sortByPriority() {
    const priorityOrder = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const sortedData = [...displayLeads].sort((a, b) => {
      const weightA = priorityOrder[a.priority] || 0; // fallback to 0 if missing
      const weightB = priorityOrder[b.priority] || 0;
      return weightB - weightA;
    });
    setDisplayLeads(sortedData);
  }

  return (
  <>
  <main className="container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4">
    <div className="row justify-content-center">
      <div className="col-12 col-xl-11">
        
        <h1 className="mb-4 fw-bold text-dark display-6">Lead List</h1>
        
        {/* Main List Container */}
        <div className="list-group shadow-sm border-0 overflow-hidden mb-5">
          
          {/* Header Row  */}
          <div className="list-group-item d-none d-lg-flex bg-dark text-white fw-bold py-3 border-0 rounded-top px-4">
            <div style={{ width: "16.66%" }} className="text-start">
              <i className="bi bi-person me-2 text-white-50"></i>NAME
            </div>
            <div style={{ width: "16.66%" }} className="text-start">
              <i className="bi bi-arrow-repeat me-2 text-white-50"></i>STATUS
            </div>
            <div style={{ width: "16.66%" }} className="text-start">
              <i className="bi bi-funnel me-2 text-white-50"></i>SOURCE
            </div>
            <div style={{ width: "16.66%" }} className="text-start">
              <i className="bi bi-person-badge me-2 text-white-50"></i>SALES AGENT
            </div>
            <div style={{ width: "16.66%" }} className="text-start">
              <i className="bi bi-clock-history me-2 text-white-50"></i>TIME TO CLOSE
            </div>
            <div style={{ width: "16.66%" }} className="text-start">
              <i className="bi bi-flag me-2 text-white-50"></i>PRIORITY
            </div>
          </div>
          {loading ? (
            <div className="text-center py-5 my-3 bg-white">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="fs-5 text-secondary fw-semibold">Loading data, please wait...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 my-3 bg-white px-3">
              <i className="bi bi-exclamation-triangle text-danger display-5 d-block mb-3"></i>
              <p className="fs-4 text-danger fw-bold mb-1">Oops! Something went wrong.</p>
              <p className="text-muted small">{error.message || "Failed to fetch resource."}</p>
            </div>
          ) : displayLeads.length > 0 ? (
            displayLeads.map((lead) => {
              return (
                <Link 
                  to={`/leadsManagement/${lead._id}`}
                  key={lead._id} 
                  className="list-group-item list-group-item-action d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center py-3 py-lg-4 px-4 gap-2 gap-lg-0 border-start-0 border-end-0"
                >
                  {/* Column 1: Lead Name */}
                  <div style={{ lgWidth: "16.66%" }} className="flex-grow-1 flex-lg-grow-0 col-lg-2 fs-5 fw-bold text-dark text-truncate">
                    <span className="d-lg-none text-muted small fw-bold text-uppercase d-block mb-1">Name</span>
                    {lead.name}
                  </div>

                  {/* Column 2: Status */}
                  <div style={{ lgWidth: "16.66%" }} className="flex-grow-1 flex-lg-grow-0 col-lg-2">
                    <span className="d-lg-none text-muted small fw-bold text-uppercase d-block mb-1">Status</span>
                    <span className="badge rounded-pill bg-primary px-3 py-1.5 fs-6 fw-medium">
                      {lead.status}
                    </span>
                  </div>

                  {/* Column 3: Source */}
                  <div style={{ lgWidth: "16.66%" }} className="flex-grow-1 flex-lg-grow-0 col-lg-2 text-secondary fs-6 text-truncate">
                    <span className="d-lg-none text-muted small fw-bold text-uppercase d-block mb-1">Source</span>
                    {lead.source}
                  </div>

                  {/* Column 4: Sales Agent */}
                  <div style={{ lgWidth: "16.66%" }} className="flex-grow-1 flex-lg-grow-0 col-lg-2 fs-6 text-dark text-truncate">
                    <span className="d-lg-none text-muted small fw-bold text-uppercase d-block mb-1">Sales Agent</span>
                   {lead.salesAgent === null || !lead.salesAgent.name ? "Unassigned" : lead.salesAgent.name}
                  </div>

                  {/* Column 5: Time To Close */}
                  <div style={{ lgWidth: "16.66%" }} className="flex-grow-1 flex-lg-grow-0 col-lg-2 d-flex align-items-center">
                    <div className="w-100">
                      <span className="d-lg-none text-muted small fw-bold text-uppercase d-block mb-1">Time to Close</span>
                      <span className="fs-5 fw-bold text-dark me-1">{lead.timeToClose}</span>
                      <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>
                        Days
                      </span>
                    </div>
                  </div>

                  {/* Column 6: Priority */}
                  <div style={{ lgWidth: "16.66%" }} className="flex-grow-1 flex-lg-grow-0 col-lg-2">
                    <span className="d-lg-none text-muted small fw-bold text-uppercase d-block mb-1">Priority</span>
                    <span className="text-danger fw-bolder fs-5">{lead.priority}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-5 bg-light border-0">
              <p className="fs-5 text-muted fw-medium m-0">No data available at the moment.</p>
            </div>
          )}
        </div>

        {/* Actions/ Filters Panel */}
        <div className="card shadow-sm border-0 py-3">
          <div className="border-bottom pb-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-3 px-3 px-md-4">
            <span className="fs-4 fw-bold text-dark">Actions</span>
            <button
              type="button"
              className="btn btn-outline-danger rounded-pill btn-sm fw-medium px-4"
              onClick={() => setFilterData({ salesAgent: "All", status: "All" })}
            >
              Clear All Filters
            </button>
          </div>

          <div className="px-3 px-md-4">
            {/* Filter Row Controls */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-4 gap-2 gap-md-4">
              <div className="text-muted fw-bold text-nowrap min-width-80">
                <i className="bi bi-funnel me-2"></i>Filter
              </div>
              <div className="d-flex flex-wrap gap-3 w-100">
                <div className="flex-fill" style={{ minWidth: "220px", maxWidth: "300px" }}>
                  <select
                    name="status"
                    className="form-select border border-2 bg-white shadow-sm py-2"
                    value={filterData.status}
                    onChange={handleFilterChange}
                  >
                    <option value="New">Status: New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>

                <div className="flex-fill" style={{ minWidth: "220px", maxWidth: "300px" }}>
                  <select
                    name="salesAgent"
                    className="form-select border border-2 bg-white shadow-sm py-2"
                    onChange={handleFilterChange}
                  >
                    <option value="All">Sales Agent: All</option>
                    {agents.length > 0 ? (
                      agents.map((agent, idx) => (
                        <option key={idx} value={agent._id}>
                          {agent.name}
                        </option>
                      ))
                    ) : (
                      <option value="">None</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Sorting and Deep Navigation Row */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 pt-2">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-4">
                <div className="text-muted fw-bold text-nowrap min-width-80">
                  <i className="bi bi-sort-down me-2"></i>Sort By
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-white shadow-sm border border-2 py-2 px-3 text-dark fw-semibold"
                    onClick={sortByPriority}
                  >
                    Priority: High to Low
                  </button>
                  <button
                    type="button"
                    className="btn btn-white shadow-sm border border-2 py-2 px-3 text-dark fw-semibold"
                    onClick={sortByTimeToClose}
                  >
                    Time to Close: ASC 
                    <i className="bi bi-sort-numeric-down ms-2 text-primary"></i>
                  </button>
                </div>
              </div>

              {/* Action Button Navigation Links */}
              <div className="mt-3 mt-md-0 ms-md-auto">
                <Link
                  to="/addNewLead"
                  className="btn btn-primary d-inline-flex align-items-center justify-content-center px-4 py-2.5 border-0 shadow-sm rounded-3 fw-bold text-nowrap"
                >
                  <i className="bi bi-plus-lg me-2 fs-6"></i>
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

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { useParams } from "react-router-dom";
import { useToastLoader } from "../components/useToastLoader";

export default function LeadsByStatus() {
  const [filterData, setFilterData] = useState({
    priority: "",
    salesAgent: "",
  });
  const { status } = useParams();
  const { data, loading, error } = useFetch(
    `https://anvaya-crm-backend-puce.vercel.app/leads?status=${status}`,
  );
  const [leads, setLeads] = useState([]);
  const [displayLeads, setDisplayLeads] = useState([]);
  const { hasFetched } = useToastLoader(loading, error, data, {
      loading: "loading leads details...",
      error: "Failed to load leads details",
    });

  useEffect(() => {
    if (data && data.length > 0) {
      setLeads(data);
      setDisplayLeads(data.filter((lead, index) => index < 5));
      // setLeadName(data[0].salesAgent.name)
    }
  }, [data]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  }

  useEffect(() => {
    if (leads.length > 0) {
      const newData = leads.filter((lead) => {
        return Object.entries(filterData).every(([key, value]) => {
          if (!value || value === "All") return true;
          if (key === "salesAgent") return lead[key]?.name === value;
          
          return lead[key] === value;
        });
      });
      setDisplayLeads(newData);
    }
  }, [leads, filterData]);

  function sortByTimeToClose() {
    const sortedData = [
      ...displayLeads.sort((a, b) => a.timeToClose - b.timeToClose),
    ];
    setDisplayLeads(sortedData);
  }

  return (
   <>
  <main className="container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4">
    <div className="row justify-content-center">
      {/* Container adapts width symmetrically based on device display size */}
      <div className="col-12 col-xl-10">
        
        {/* Main Headings */}
        <div className="mb-4">
          <h1 className="display-5 display-md-4 text-primary mb-2 ">
            Lead By Status
          </h1>
          <h2 className="h5 h4-md text-secondary m-0">
            <i className="bi bi-list-ul me-2"></i>
            Leads List by Status
          </h2>
        </div>

        {/* List Group Section */}
        <div className="row mb-4">
          <div className="col-12">
            <section className="card shadow-sm border-0 overflow-hidden">
              <div className="card-header bg-primary text-white d-flex align-items-center py-3">
                <i className="bi bi-plus-circle-dotted me-2 text-white-50"></i>
                <h3 className="h5 mb-0 fw-semibold">Status: {status}</h3>
              </div>
              <ul className="list-group list-group-flush">
                {/* Header Row - Maintained tight alignment spaces */}
                <li className="list-group-item bg-light border-bottom">
                  <div className="row fw-bold text-uppercase small text-muted">
                    <div className="col-4 text-start">
                      <i className="bi bi-person me-1"></i> Lead Name
                    </div>
                    <div className="col-4 text-center">
                      <i className="bi bi-headset me-1"></i> Lead Agent
                    </div>
                    <div className="col-4 text-end">
                      <i className="bi bi-clock-history me-1"></i> Time To Close
                    </div>
                  </div>
                </li>

                {/* Dynamic Lead Rows / States */}
                {loading ? (
                  <div className="text-center py-5 my-3">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p className="fs-5 text-secondary fw-semibold">
                      Loading data, please wait...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-5 my-3 px-3">
                    <i className="bi bi-exclamation-triangle text-danger display-5 d-block mb-3"></i>
                    <p className="fs-4 text-danger fw-bold mb-1">
                      Oops! Something went wrong.
                    </p>
                    <p className="text-muted small">
                      {error.message || "Failed to fetch resource."}
                    </p>
                  </div>
                ) : displayLeads.length > 0 ? (
                  displayLeads.map((lead) => (
                    <li key={lead.id} className="list-group-item py-3">
                      {/* Using fixed col-4 splits here keeps spacing perfectly uniform on all screen views */}
                      <div className="row align-items-center">
                        {/* Lead Name column */}
                        <div className="col-4 text-start text-truncate">
                          <span className="fw-semibold text-dark">{lead.name}</span>
                        </div>
                        
                        {/* Lead Agent column */}
                        <div className="col-4 text-center text-secondary text-truncate">
                          <span>
                            <i className="bi bi-person-badge me-1 d-none d-sm-inline"></i>
                            {lead.salesAgent.name}
                          </span>
                        </div>
                        
                        {/* Time To Close column */}
                        <div className="col-4 text-end text-nowrap">
                          <span className="fs-5 fw-bold text-dark me-1">{lead.timeToClose}</span>
                          <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>
                            Days
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-center py-5 my-4 px-3 bg-light m-3 rounded border">
                    <p className="fs-5 text-muted fw-medium m-0">
                      No data available at the moment.
                    </p>
                  </div>
                )}
              </ul>
            </section>
          </div>
        </div>

        {/* Actions & Filters Controls Card */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 py-3">
              <div className="border-bottom pb-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 px-md-4">
                <span className="fs-4 fw-bold text-dark">Actions</span>
                <button
                  type="button"
                  className="btn btn-outline-danger rounded-pill btn-sm fw-medium px-3"
                  onClick={() => setFilterData({ salesAgent: "All", status: "All" })}
                >
                  Clear All Filters
                </button>
              </div>

              <div className="px-3 px-md-4">
                {/* Filters Group */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-4 gap-2 gap-md-4">
                  <div className="text-muted fw-bold text-nowrap pb-1 pb-md-0">
                    <i className="bi bi-funnel me-2"></i>Filter
                  </div>
                  
                  <div className="d-flex flex-wrap gap-3 w-100">
                    <div className="flex-fill" style={{ minWidth: "200px", maxWidth: "300px" }}>
                      <select
                        name="priority"
                        className="form-select border border-2 bg-white shadow-sm py-2"
                        onChange={handleFilterChange}
                      >
                        <option defaultValue value="High">Priority: High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="flex-fill" style={{ minWidth: "200px", maxWidth: "300px" }}>
                      <select
                        name="salesAgent"
                        className="form-select border border-2 bg-white shadow-sm py-2"
                        onChange={handleFilterChange}
                      >
                        <option defaultValue value="All">Sales Agent: All</option>
                        {leads.length > 0 ? (
                          leads.map((l, index) => (
                            <option key={index} value={l.salesAgent.name}>
                              {l.salesAgent.name}
                            </option>
                          ))
                        ) : (
                          <option value="">None</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sorting Actions */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 gap-md-4">
                  <div className="text-muted fw-bold text-nowrap pb-1 pb-md-0">
                    <i className="bi bi-sort-down me-2"></i>Sort By
                  </div>
                  <div>
                    <button
                      className="btn btn-white shadow-sm border border-2 py-2 px-3 text-dark fw-semibold"
                      onClick={sortByTimeToClose}
                    >
                      Time to Close: ASC 
                      <i className="bi bi-sort-numeric-down ms-2 text-primary"></i>
                    </button>
                  </div>
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

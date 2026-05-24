import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Link, useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { statusColorArray } from "./Home";
import { useToastLoader } from "../components/useToastLoader";

export default function LeadsBySalesAgent() {
  const [filterData, setFilterData] = useState({
    priority: "",
    status: ""
  })
  const {agentId} = useParams()
  const {data , loading, error} = useFetch(`https://anvaya-crm-backend-puce.vercel.app/leads?salesAgent=${agentId}`)
  const [leads, setLeads] = useState([])
  const [displayLeads, setDisplayLeads] = useState([])
  const [leadName, setLeadName] = useState("")
  const { hasFetched } = useToastLoader(loading, error, data, {
      loading: "loading leads details...",
      error: "Failed to load leads details",
    });

  useEffect(() => {
    if (data && data.length > 0) {
          setLeads(data);
          setDisplayLeads(data.filter((lead, index) => index < 5));
          setLeadName(data[0].salesAgent.name)
        }
  },[data])

  function handleFilterChange(e){
    const {name, value} = e.target
    setFilterData({...filterData, [name]: value})
  }

  useEffect(() => {
    if(leads.length > 0){
      const newData =  leads.filter(lead => {
        return Object.entries(filterData).every(([key , value]) => {
          if(!value || value === "All") return true 
          return lead[key]=== value
        })
      })
      setDisplayLeads(newData)
    }
  }, [filterData])

  function sortByTimeToClose(){
    const sortedData = [...displayLeads.sort((a, b) => a.timeToClose - b.timeToClose)]
    setDisplayLeads(sortedData)
  }

  
  function colorByStatus(status){
    const selectedColor = statusColorArray.reduce((acc, curr) => curr.label === status ? acc = curr.color : acc, "")
    return selectedColor
  }

  return (
    <>
     <main className="container-fluid px-3 px-md-4">
  <div className="row justify-content-center ">
    <div className="col-12 col-lg-10">
      <div className="pe-0 pe-md-4">
        {/* Main Heading */}
        <h1 className="display-5 display-md-4 text-primary my-3">
          Lead By Sales Agent
        </h1>

        {/* Sub Heading */}
        <h2 className="h4 text-secondary my-3">
          <i className="bi bi-list-ul me-2"></i>
          Leads List by Agent
        </h2>

        {/* List Group Section */}
        <div className="row">
          <div className="col-12">
            <section className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white d-flex align-items-center py-3">
                <i className="bi bi-person-workspace me-2"></i>
                <h3 className="h5 mb-0">Agent: {leadName}</h3>
              </div>

              <ul className="list-group list-group-flush">
                {/* Header Row */}
                <li className="list-group-item bg-light border-bottom d-none d-md-block">
                  <div className="row fw-bold text-uppercase small text-muted">
                    <div className="col-md-4">
                      <i className="bi bi-building me-1"></i> Firm Name
                    </div>
                    <div className="col-md-4 text-md-center">
                      <i className="bi bi-info-circle me-1"></i> Status
                    </div>
                    <div className="col-md-4 text-md-end">
                      <i className="bi bi-person-badge me-1"></i> Assigned Agent
                    </div>
                  </div>
                </li>

                {/* Dynamic Lead Rows */}
                {loading ? (
                  <div className="text-center py-4 my-4">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p className="fs-4 text-secondary fw-semibold">
                      Loading data, please wait...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center py-4 my-4 px-3">
                    <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
                    <p className="fs-3 text-danger fw-bold">
                      Oops! Something went wrong.
                    </p>
                    <p className="text-muted fs-5">
                      {error || "Failed to fetch resource."}
                    </p>
                  </div>
                ) : displayLeads.length > 0 ? (
                  displayLeads.map((lead) => {
                    let statusColor = colorByStatus(lead.status);
                    return (
                      <li key={lead._id} className="list-group-item py-3 px-3">
                        {/* Stacks vertically on mobile, row layout on desktop */}
                        <div className="row g-2 align-items-center">
                          {/* Firm Name Column */}
                          <div className="col-12 col-md-4">
                            <span className="d-md-none text-muted small fw-bold text-uppercase block-label">Firm: </span>
                            <span className="fw-semibold text-dark">
                              {lead.name}
                            </span>
                          </div>

                          {/* Status Column */}
                          <div className="col-12 col-md-4 text-start text-md-center">
                            <span className="d-md-none text-muted small fw-bold text-uppercase block-label">Status: </span>
                            <span
                              style={{ backgroundColor: `${statusColor}` }}
                              className="badge rounded-pill"
                            >
                              {lead.status}
                            </span>
                          </div>

                          {/* Agent Column */}
                          <div className="col-12 col-md-4 text-start text-md-end text-secondary">
                            <span className="d-md-none text-muted small fw-bold text-uppercase block-label">Agent: </span>
                            {lead.salesAgent.name}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <div className="text-center py-5 my-5 mx-3 border rounded bg-light">
                    <p className="fs-3 text-muted fw-medium m-0">
                      No data available at the moment.
                    </p>
                  </div>
                )}
              </ul>
            </section>
          </div>
        </div>

        {/* Actions / Filters Panel */}
        <div className="col-12 py-4 mt-2">
          <div className="card shadow border-0 py-3">
            <div className="border-bottom border-1 pb-3 mb-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between px-4 w-100 gap-2">
              <span className="fw-bold fs-3 text-dark">
                Actions
              </span>
              <button
                type="button"
                className="btn btn-outline-danger rounded-pill btn-md fw-medium"
                onClick={() => setFilterData({ salesAgent: "All", status: "All" })}
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="card-body p-0 px-4">
              {/* Row 1: Filters */}
              <div className="row align-items-center mb-4 gap-2 gap-md-0">
                <div className="col-12 col-md-2 col-lg-1 mb-2 mb-md-0">
                  <span className="fw-bold text-muted">
                    <i className="bi bi-funnel me-2"></i>Filter
                  </span>
                </div>
                <div className="col-12 col-md-10 d-flex flex-column flex-sm-row gap-3">
                  <div className="w-100" style={{ maxWidth: "280px" }}>
                    <select 
                      name="priority" 
                      className="form-select border-0 shadow-sm py-2" 
                      value={filterData.priority} 
                      onChange={handleFilterChange}
                    >
                      <option value="High">Priority: High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="w-100" style={{ maxWidth: "280px" }}>
                    <select 
                      name="status" 
                      className="form-select border-0 shadow-sm py-2" 
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
                </div>
              </div>

              {/* Row 2: Sort By */}
              <div className="row align-items-center gap-2 gap-md-0">
                <div className="col-12 col-md-2 col-lg-1 mb-2 mb-md-0">
                  <span className="fw-bold text-muted">
                    <i className="bi bi-sort-down me-2"></i>Sort
                  </span>
                </div>
                <div className="col-12 col-md-10">
                  <button 
                    className="btn btn-white shadow-sm border-0 py-2 px-3 text-dark fw-semibold w-auto" 
                    onClick={sortByTimeToClose}
                  >
                    Time to Close: ASC 
                    <i className="bi bi-sort-numeric-down ms-2"></i>
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

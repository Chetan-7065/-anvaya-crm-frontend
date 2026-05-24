import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import useFetch from "../useFetch";
import { useEffect, useMemo, useState } from "react";
import { useToastLoader } from "../components/useToastLoader";

export default function SalesAgentManagement() {
  const { data, loading, error } = useFetch(
    "https://anvaya-crm-backend-puce.vercel.app/agents",
  );
    const {data: leadsData, loading: leadsLoading, error: leadsError} = useFetch("https://anvaya-crm-backend-puce.vercel.app/leads")
  
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [displayAgents, setdisplayAgents] = useState([]);
  const { hasFetched } = useToastLoader(loading, error, data, {
      loading: "loading agents details...",
      error: "Failed to load agents details",
    });
  useEffect(() => {
    if (data && data.length > 0) {
      setAgents(data);
      setdisplayAgents(data);
      
    }
    if (leadsData && leadsData.length > 0) {
      setLeads(leadsData);
    }
    
  }, [data, leadsData]);


   const statusData = useMemo(() => {
  const counts = {};
  
  if (leads && leads.length > 0) {
    leads.forEach((lead) => {
      const agentName = lead.salesAgent?.name || "Unassigned";
      counts[agentName] = (counts[agentName] || 0) + 1;
    });
  }
  return displayAgents.map(agentItem => ({
    ...agentItem,
    leads: counts[agentItem.name || agentItem.agentName] || 0 
  }));
  
}, [leads, displayAgents]); 

  return (
   <>
  <main className="container-fluid">
    <div className="row justify-content-center">
      <div className="col-12 col-xl-10 py-3">
        <h1 className="mb-3 h2 fw-bold text-dark">Agents List</h1>

        <div className="table-responsive-sm mt-4 rounded border shadow-sm bg-white">
          <ul className="list-group list-group-flush" style={{ minWidth: "600px" }}>
            {/* Table Header Row */}
            <li className="list-group-item border-bottom border-secondary bg-light fw-bold text-secondary py-3">
              <div className="row text-center align-items-center">
                <div className="col-1">S.No</div>
                <div className="col-4 text-start">Agent</div>
                <div className="col-5 text-start">Email Address</div>
                <div className="col-2">Total Leads</div>
              </div>
            </li>

            {loading ? (
              <div className="text-center py-5 my-4">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="fs-5 text-secondary fw-semibold">Loading data, please wait...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5 my-4">
                <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
                <p className="fs-4 text-danger fw-bold">Oops! Something went wrong.</p>
                <p className="text-muted small">{error.message || "Failed to fetch resource."}</p>
              </div>
            ) : statusData.length > 0 ? (
              statusData.map((agent, index) => (
                <li key={index} className="list-group-item list-group-item-action border-bottom align-items-center py-3">
                  <Link
                    className="row text-center text-decoration-none text-dark align-items-center"
                    to={`/leadsBySalesAgent/${agent._id}`}
                  >
                    <div className="col-1 fw-semibold text-muted">{index + 1}</div>
          
                    <div className="col-4 text-start fw-medium text-truncate">{agent.name}</div>
                    <div className="col-5 text-start text-muted text-break">{agent.email}</div>
                    <div className="col-2 fw-bold text-primary">
                      <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                        {agent.leads}
                      </span>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <div className="text-center py-5 my-5 bg-white">
                <p className="fs-5 text-muted fw-medium m-0">No data available at the moment.</p>
              </div>
            )}
          </ul>
        </div>

        {/* Action Button Section Card */}
        <div className="border mt-4 shadow-sm rounded-3 card bg-white">
          <div className="card-header bg-white border-bottom border-3 mt-1 border-primary py-3">
            <h5 className="mb-0 fw-bold text-uppercase px-1 small text-muted" style={{ letterSpacing: "1px" }}>
              Actions
            </h5>
          </div>

          <div className="card-body bg-white p-3">
            <Link
              to={"/addNewSalesAgent"}
              className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 shadow-sm py-2 px-3"
              style={{ minWidth: "180px", maxWidth: "100%" }}
            >
              <i className="bi bi-person-plus-fill fs-5"></i> Add New Agents
            </Link>
          </div>
        </div>

      </div>
    </div>
  </main>
</>
  );
}

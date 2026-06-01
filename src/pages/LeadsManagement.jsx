import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { useParams, useSearchParams } from "react-router-dom";
import { useToastLoader } from "../components/useToastLoader";
import axios from "axios";
import { toast } from "react-toastify";

export default function LeadsManagement() {
  const [comment, setComment] = useState([]);
  const [displayComments, setDisplayComments] = useState([]);
  const [lead, setLead] = useState([]);
  const [salesAgent, setSalesAgent] = useState([]);
  const [agentId, setAgentId] = useState("");
  const { leadId } = useParams();
  const leadStatus = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];
  const leadSource = [
    "Website",
    "Referral",
    "Cold Call",
    "Advertisement",
    "Email",
    "Other",
  ];
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    priority: "",
    timeToClose: "",
    tags: [],
  });
  const [commentFormData, setCommentFormData] = useState({
    lead: "",
    author: "",
    commentText: "",
  });

  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    refetch: commentsRefetch,
  } = useFetch(
    `https://anvaya-crm-backend-puce.vercel.app/leads/${leadId}/comments`,
  );

  const {
    data: leadsData,
    loading: leadsLoading,
    error: leadsError,
    refetch: leadsRefetch,
  } = useFetch("https://anvaya-crm-backend-puce.vercel.app/leads");
  const {
    data: agentsData,
    loading: agentsLoading,
    error: agentsError,
  } = useFetch("https://anvaya-crm-backend-puce.vercel.app/agents");

  const { hasFetched } = useToastLoader(leadsLoading, leadsError, leadsData, {
    loading: "loading lead  details...",
    error: "Failed to load lead details",
  });
  useEffect(() => {
    if (commentsData && commentsData.length > 0) {
      setComment(commentsData);
      setDisplayComments(commentsData);
    }
    if (leadsData && leadsData.length > 0) {
      const selectedLead = leadsData.filter((lead) => lead._id === leadId);
      setLead(selectedLead);
    }
    if (agentsData && agentsData.length > 0) {
      setSalesAgent(agentsData);
    }
  }, [commentsData, leadsData, agentsData]);

  const handleEditChanges = (leadId) => {
    const changeLead = leadsData.find((lead) => lead._id === leadId);
    const selectedAgentId = changeLead.salesAgent?._id
    if (changeLead) {
      if(changeLead.salesAgent === null || !changeLead.salesAgent.name){
        setFormData({
          ...changeLead,
          salesAgent: "Unassigned"
        });
        setAgentId("Unassigned");
      }else{
        setFormData({
        ...changeLead,
        salesAgent: selectedAgentId
          ? selectedAgentId
          : "",
      })
        setAgentId(changeLead.salesAgent._id);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "salesAgent") {
      const selectedAgent = salesAgent.find((agent) => agent._id === value);

      setFormData({
        ...formData,
        salesAgent: selectedAgent
          ? selectedAgent._id
          : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;

    if (name === "author") {
      const selectedAgent = salesAgent.find((agent) => agent._id === value);

      setCommentFormData({
        ...commentFormData,
        lead: leadId,
        author: selectedAgent
          ? { _id: selectedAgent._id, name: selectedAgent.name }
          : "",
      });
    } else {
      setCommentFormData({ ...commentFormData, [name]: value });
    }
  };


  const handleMultiSelect = (e, field) => {
    const options = [...e.target.selectedOptions].map((opt) => opt.value);
    setFormData({ ...formData, [field]: options });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
    };
    console.log("Lead Created:", payload);
    try {
      const response = await axios.post(
        `https://anvaya-crm-backend-puce.vercel.app/leads/${leadId}`,
        payload,
      );
      toast.success("Lead updated successfully");
      leadsRefetch();
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...commentFormData,
      author: commentFormData.author?._id,
    };
    console.log("Comment Created:", payload);
    try {
      const response = await axios.post(
        `https://anvaya-crm-backend-puce.vercel.app/leads/${leadId}/comments`,
        payload,
      );
      toast.success("Comment updated successfully");
      setCommentFormData({
        lead: "",
        author: "",
        commentText: "",
      });
      commentsRefetch();
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
  return (
    <>
      <main>
        <div className="row ">
          <div
            className="col m-3"
            style={{ height: "90vh", overflowY: "auto" }}
          >
            <h1 className="mb-4">Lead Management</h1>
            <div className="w-100">
              <div
                className="card shadow-sm w-100 border-1"
                style={{ fontSize: "1rem" }}
              >
                <div className="card-header bg-white py-2 px-3 border-2 border-bottom ">
                  <h2
                    className="large-header mb-0 text-dark fw-bold"
                    style={{ fontSize: "1.7rem" }}
                  >
                    <i className="bi bi-card-list me-3"></i>Lead Details
                  </h2>
                </div>

                {leadsLoading ? (
                  <div className="text-center py-4 my-4">
                    <div
                      className="spinner-border text-primary mb-3"
                      role="status"
                    ></div>
                    <p className="fs-4 text-secondary fw-semibold">
                      Loading data, please wait...
                    </p>
                  </div>
                ) : leadsError ? (
                  <div className="text-center py-4 my-4">
                    <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
                    <p className="fs-3 text-danger fw-bold">
                      Oops! Something went wrong.
                    </p>
                    <p className="text-muted fs-5">
                      {leadsError.message || "Failed to fetch resource."}
                    </p>
                  </div>
                ) : lead && lead.length > 0 ? (
                  lead.map((item) => {
                    return (
                      <div key={item._id} className="card-body p-4">
                        <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                          <span
                            className="label-width text-dark fw-semibold "
                            style={{
                              minWidth: "120px",
                              display: "inline-block",
                            }}
                          >
                            <i className="bi bi-person-fill me-2"></i>Lead Name:
                          </span>
                          <span className="text-dark fw-bold">{item.name}</span>
                        </div>

                        <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                          <span
                            className="label-width text-dark fw-semibold"
                            style={{
                              minWidth: "120px",
                              display: "inline-block",
                            }}
                          >
                            <i className="bi bi-person-badge me-2"></i>Sales
                            Agent:
                          </span>
                          <span className="text-dark fw-bold">
                            {item.salesAgent === null || !item.salesAgent.name ? "Unassigned" : item.salesAgent.name}
                          </span>
                        </div>

                        <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                          <span
                            className="label-width text-dark fw-semibold"
                            style={{
                              minWidth: "120px",
                              display: "inline-block",
                            }}
                          >
                            <i className="bi bi-globe2 me-2"></i>Lead Source:
                          </span>
                          <span className="text-dark fw-bold">
                            {item.source}
                          </span>
                        </div>

                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center mb-4 border-bottom pb-3">
                          <span
                            className="label-width text-dark fw-semibold mb-2 mb-sm-0"
                            style={{
                              minWidth: "140px",
                              display: "inline-block",
                            }}
                          >
                            <i className="bi bi-activity me-2 text-primary"></i>
                            Lead Status:
                          </span>

                          <span className="badge bg-primary px-3 py-2 text-wrap text-start">
                            {item.status}
                          </span>
                        </div>

                        <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                          <span
                            className="label-width text-dark fw-semibold"
                            style={{
                              minWidth: "100px",
                              display: "inline-block",
                            }}
                          >
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            Priority:
                          </span>
                          <span className="text-danger fw-bold">
                            {item.priority}
                          </span>
                        </div>

                        <div className="d-flex align-items-center mb-1">
                          <span
                            className="label-width text-dark fw-semibold"
                            style={{
                              minWidth: "130px",
                              display: "inline-block",
                            }}
                          >
                            <i className="bi bi-calendar-check me-2"></i>Time to
                            Close:
                          </span>
                          <span className="text-dark fw-bold">
                            {item.timeToClose} Days
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-5 my-5 border rounded bg-light">
                    <p className="fs-3 text-muted fw-medium m-0">
                      No data available at the moment.
                    </p>
                  </div>
                )}

                <div className="card-footer bg-white py-3 px-4 ">
                  <button
                    className="btn btn-primary btn-lg px-3 shadow-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#leadDetailsModal"
                    onClick={() => handleEditChanges(leadId)}
                  >
                    <i className="bi bi-pencil-square me-2"></i> Edit Details
                  </button>
                </div>
              </div>
            </div>

            {/* Comment Section Container */}
            <div
              className="w-100 bg-white border rounded shadow-sm d-flex flex-column position-relative mt-3"
              style={{ height: "400px", overflow: "hidden" }}
            >
              <div className="card-header bg-white py-3 px-4 border-bottom shadow-sm z-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <i className="bi bi-chat-square-dots-fill me-2 text-primary"></i>
                  Comment Section
                </h5>
              </div>

              <div className="flex-grow-1 overflow-auto p-3 pb-5 bg-white">
                {displayComments.length > 0 && !commentsLoading
                  ? displayComments.map((comment) => {
                      const dateObj = new Date(comment.createdAt);
                      const formattedDate = dateObj.toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      );
                      const formattedTime = dateObj.toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        },
                      );
                      return (
                        <div
                          key={comment._id}
                          className="card border-0 shadow-sm mb-3 rounded-3"
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="fw-bold text-dark">
                                {comment.author}
                              </span>
                              <small className="text-muted">
                                {formattedDate} • {formattedTime}
                              </small>
                            </div>
                            <p className="mb-0 text-secondary">
                              {comment.commentText}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  : null}
                <div style={{ height: "40px" }}></div>
              </div>

              {/* Input strip */}
              <div className="position-absolute bottom-0 w-100 p-3 bg-white border-top shadow-lg z-3">
                <form onSubmit={handleCommentSubmit}>
                  <div className="input-group ">
                    {/* Agent Selector Dropdown */}
                    <select
                      className="form-select border-light-subtle bg-white text-muted"
                      name="author"
                      value={formData.salesAgent?._id}
                      onChange={handleCommentChange}
                      required
                      style={{
                        maxWidth: "180px",
                        paddingLeft: "1rem",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                    >
                      <option value="" hidden>
                        Select agent...
                      </option>
                      {salesAgent.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>

                    {/* Text Input */}
                    <input
                      type="text"
                      name="commentText"
                      value={commentFormData.commentText}
                      onChange={handleCommentChange}
                      className="form-control border-light-subtle bg-light"
                      placeholder="Type a quick update..."
                      style={{ padding: "0.75rem 1.25rem", fontSize: "1.1rem" }}
                      required
                    />

                    {/* Post Button */}
                    <button
                      className="btn btn-primary px-4 d-flex align-items-center"
                      type="submit"
                    >
                      <i className="bi bi-send-fill me-2"></i>
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Window */}
            <div
              className="modal fade"
              id="leadDetailsModal"
              tabIndex="-1"
              aria-labelledby="leadDetailsModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                  <div className="modal-header bg-white">
                    <h5
                      className="modal-title fw-bold"
                      id="leadDetailsModalLabel"
                    >
                      Edit Leads Details
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="card-body p-5 bg-white">
                    <form onSubmit={handleSubmit} className="row">
                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold text-secondary">
                          Lead Name:
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control border-2 py-2"
                          placeholder="Enter lead name"
                          value={formData.name || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold text-secondary">
                          Lead Source:
                        </label>
                        <select
                          name="source"
                          className="form-select border-2"
                          value={formData.source || ""}
                          onChange={handleChange}
                        >
                          {leadSource.map((source, index) => (
                            <option key={index} value={source}>
                              {source}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold text-secondary">
                          Sales Agent:
                        </label>
                        <select
                          name="salesAgent"
                          className="form-select border-2"
                          value={formData.salesAgent}
                          onChange={handleChange}
                        >
                          <option  value="">
                              Unassigned
                            </option>
                          {salesAgent.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold text-secondary">
                          Lead Status:
                        </label>
                        <select
                          name="status"
                          className="form-select border-2"
                          value={formData.status || ""}
                          onChange={handleChange}
                        >
                           <option value="">Select a status</option>
                          {leadStatus.map((status, index) => (
                            <option key={index} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold text-secondary">
                          Priority:
                        </label>
                        <select
                          name="priority"
                          className="form-select border-2"
                          value={formData.priority || "Medium"}
                          onChange={handleChange}
                        >
                            <option value="">Select priority</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>

                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold text-secondary">
                          Time to Close (Days):
                        </label>
                        <input
                          type="number"
                          name="timeToClose"
                          className="form-control border-2 py-2"
                          value={formData.timeToClose || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12 mb-4">
                        <label className="form-label fw-semibold text-secondary">
                          Tags (Ctrl/Cmd to select multiple):
                        </label>
                        <select
                          multiple
                          name="tags"
                          className="form-select border-2"
                          value={formData.tags || []}
                          onChange={(e) => handleMultiSelect(e, "tags")}
                        >
                          <option value="Enterprise">Enterprise</option>
                          <option value="Urgent">Urgent</option>
                          <option value="SaaS">SaaS</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="High Value">High Value</option>
                        </select>
                      </div>

                      <div className="col-12 d-grid mt-3">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg fw-bold shadow-sm py-3 text-uppercase"
                          data-bs-dismiss="modal"
                        >
                          Update Lead
                        </button>
                      </div>
                    </form>
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

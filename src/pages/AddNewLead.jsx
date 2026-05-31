import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function AddNewLead() {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    priority: "",
    timeToClose: "",
    tags: [],
  });
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMultiSelect = (e, field) => {
    const options = [...e.target.selectedOptions].map((opt) => opt.value);
    setFormData({ ...formData, [field]: options });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Lead Created:", formData);

    try{
      const response = await axios.post("https://anvaya-crm-backend-puce.vercel.app/leads", formData)
      console.log(response.data)
      navigate("/leads")
       toast.success("New lead Added successfully");
    }catch(error){
      if(error.response){
        console.log("Status: ", error.response.status)
        console.log("Data: ", error.response.data)
      }else if(error.request){
        console.log("Network error: Is the backend running?")
      }else{
        console.log("Setup Error: ", error.message)
      }
    }
  };

  const {data , loading, error} = useFetch("https://anvaya-crm-backend-puce.vercel.app/agents")
  const [salesAgent, setSalesAgent] = useState([])
  const leadStatus = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed']
  const leadSource = ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other']

  useEffect(() => {
    if(data && data.length> 0){
      setSalesAgent(data)
    }
  },[data])
  return (
    <>
    <main className="container-fluid px-2 px-sm-3 px-md-4">
  <div className="row ">
    <div className="col-12 mx-auto mt-2 mt-md-4" style={{ minHeight: "80vh", overflowY: "auto" }}>
      <div className="card shadow-lg border-2 border-light rounded-3 overflow-hidden">
        
        <div className="card-header bg-white py-3 py-md-4 border-bottom border-4 border-primary">
          <h2 className="mb-0 fw-bold text-primary text-center fs-3 fs-md-2">Add New Lead</h2>
        </div>

        <div className="card-body p-3 p-sm-4 p-md-5 bg-white">
          <form onSubmit={handleSubmit} className="row g-1">
            
            {/* Row: Lead Name */}
            <div className="col-12 mb-3 mb-md-4">
              <label className="form-label fw-semibold text-secondary">Lead Name:</label>
              <input
                type="text"
                name="name"
                className="form-control border-2 py-2"
                placeholder="Enter lead name"
                value={formData.leadName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row: Lead Source */}
            <div className="col-12 mb-3 mb-md-4">
              <label className="form-label fw-semibold text-secondary">Lead Source:</label>
              <select
                name="source"
                className="form-select border-2 py-2"
                value={formData.leadSource}
                onChange={handleChange}
                required
              >
                {leadSource.map((source, index) => {
                  return (
                    <option key={index + 1} value={source}>{source}</option>
                  )
                })}
              </select>
            </div>

            {/* Row: Sales Agent */}
            <div className="col-12 mb-3 mb-md-4">
              <label className="form-label fw-semibold text-secondary">Sales Agent :</label>
              <select
                name="salesAgent"
                className="form-select border-2 py-2"
                value={formData.salesAgent}
                onChange={handleChange}
                required
              >
                {salesAgent.map((agent) => {
                  return (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  )
                })}
              </select>
            </div>

            {/* Row: Lead Status */}
            <div className="col-12 mb-3 mb-md-4">
              <label className="form-label fw-semibold text-secondary">Lead Status:</label>
              <select
                name="status"
                className="form-select border-2 py-2"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {leadStatus.map((status, index) => {
                  return (
                    <option key={index + 1} value={status}>{status}</option>
                  )
                })}
              </select>
            </div>

            {/* Row: Priority */}
            <div className="col-12 mb-3 mb-md-4">
              <label className="form-label fw-semibold text-secondary">Priority:</label>
              <select
                name="priority"
                className="form-select border-2 py-2"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Row: Time to Close */}
            <div className="col-12 mb-3 mb-md-4">
              <label className="form-label fw-semibold text-secondary">Time to Close (Days):</label>
              <input
                type="number"
                name="timeToClose"
                className="form-control border-2 py-2"
                value={formData.timeToClose}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row: Tags */}
            <div className="col-12 mb-4">
              <label className="form-label fw-semibold text-secondary">Tags (Ctrl/Cmd to select multiple):</label>
              <select
                multiple
                name="tags"
                className="form-select border-2"
                value={formData.tags}
                onChange={(e) => handleMultiSelect(e, "tags")}
                style={{ minHeight: "120px" }} // Ensures multiselect box is easily touchable on mobile devices
                required 
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Urgent">Urgent</option>
                <option value="SaaS">SaaS</option>
                <option value="Follow-up">Follow-up</option>
                <option value="High Value">High Value</option>
              </select>
            </div>

            {/* Create Lead Button Row */}
            <div className="col-2 d-grid mt-2 mt-md-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg fw-bold shadow-sm py-2.5 py-md-3 text-uppercase fs-6 fs-md-5"
              >
                Create Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</main>
     </>
  );
}

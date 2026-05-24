import { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
export default function AddNewSalesAgent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creating Agent:", formData);
    try {
      const response = await axios.post(
        "https://anvaya-crm-backend-puce.vercel.app/agents",
        formData,
      );
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      } else if (error.request) {
        console.log("Network Error: Is the backend running?");
      } else {
        console.log("Setup Error:", error.message);
      }
    }
  };

  return (
   <>
  <main className="container-fluid px-2 px-sm-3 px-md-4">
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-5 mt-3 mt-md-5">
        <div className="card shadow-lg border-2 border-light rounded-3 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom border-4 border-primary">
            <h4 className="mb-0 fw-bold text-primary text-center fs-5 fs-md-4">
              Add New Sales Agent
            </h4>
          </div>

          <div className="card-body p-3 p-sm-4 bg-white">
            <form onSubmit={handleSubmit}>
              
              {/* Agent Name Field */}
              <div className="mb-3 mb-md-4">
                <label
                  htmlFor="name"
                  className="form-label fw-semibold text-secondary"
                >
                  Agent Name:
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-2 border-end-0">
                    <i className="bi bi-person text-primary"></i>
                  </span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    className="form-control border-2 border-start-0 py-2 focus-ring"
                    placeholder="Enter full name"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email Address Field */}
              <div className="mb-3 mb-md-4">
                <label
                  htmlFor="emailAddress"
                  className="form-label fw-semibold text-secondary"
                >
                  Email Address:
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-2 border-end-0">
                    <i className="bi bi-envelope text-primary"></i>
                  </span>
                  <input
                    type="email"
                    id="emailAddress"
                    name="email"
                    value={formData.email}
                    className="form-control border-2 border-start-0 py-2"
                    placeholder="name@email.com"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="d-grid mt-4 mt-md-5">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg fw-bold shadow-sm py-2.5 py-md-3 text-uppercase fs-6 fs-md-5"
                >
                  Create New Agent 
                </button>
              </div>
            </form>
          </div>
          <div className="card-footer bg-white py-2 text-center">
            <small className="text-muted">
              Ensure all fields are correct before submitting
            </small>
          </div>
        </div>
      </div>
    </div>
  </main>
</>
  );
}

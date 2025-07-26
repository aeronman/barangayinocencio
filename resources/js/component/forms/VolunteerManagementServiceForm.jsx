import React, { useState } from "react";
import Breadcrumb from "../ui/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../contexts/ApiContext";

function VolunteerManagementServiceForm() {
  const { postData } = useAPI();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    service_name: "",
    description: "",
    category: "Community Service",
    location: "",
    start_date: "",
    end_date: "",
    contact_person: "",
    contact_number: "",
    contact_email: "",
    volunteer_requirements: "",
    penalty_enabled: false,
    penalty_description: "",
    launch_date: "",
    availability_status: "Available",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "service_name",
      "description",
      "category",
      "location",
      "start_date",
      "end_date",
      "contact_number",
      "contact_person",
      "contact_email",
      "volunteer_requirements",
      "launch_date",
      "availability_status",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setError("Please fill out all required fields.");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await postData("vs", formData);
      setLoading(false);

      if (response?.status === 201) {
        setFormData({
          service_name: "",
          description: "",
          category: "Community Service",
          location: "",
          start_date: "",
          end_date: "",
          contact_person: "",
          contact_number: "",
          contact_email: "",
          volunteer_requirements: "",
          penalty_enabled: false,
          penalty_description: "",
          launch_date: "",
          availability_status: "Available",
        });
        
      }
      navigate("/admin/services/manage");
    } catch (err) {
      setLoading(false);
      setError("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="container mt-5">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Volunteer Management Service</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form noValidate onSubmit={handleSubmit}>
              {/* Service Name */}
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <input
                  name="service_name"
                  type="text"
                  className="form-control"
                  value={formData.service_name}
                  onChange={handleChange}
                  placeholder="Enter service name"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option>Community Service</option>
                  <option>Environmental Projects</option>
                  <option>Educational Programs</option>
                  <option>Event Support</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Location */}
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
              </div>

              {/* Dates */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  <input
                    name="start_date"
                    type="date"
                    className="form-control"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                  <input
                    name="end_date"
                    type="date"
                    className="form-control"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  name="contact_number"
                  type="tel"
                  className="form-control"
                  value={formData.contact_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Person</label>
                <input
                  name="contact_person"
                  type="text"
                  className="form-control"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Email</label>
                <input
                  name="contact_email"
                  type="email"
                  className="form-control"
                  value={formData.contact_email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Volunteer Requirements */}
              <div className="mb-3">
                <label className="form-label">Volunteer Requirements</label>
                <textarea
                  name="volunteer_requirements"
                  className="form-control"
                  value={formData.volunteer_requirements}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Penalty Policy */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="penaltySwitch"
                  name="penalty_enabled"
                  checked={formData.penalty_enabled}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="penaltySwitch">
                  Penalty Policy:{" "}
                  {formData.penalty_enabled ? "Enabled" : "Disabled"}
                </label>
              </div>

              {formData.penalty_enabled && (
                <div className="mb-3">
                  <label className="form-label">Penalty Description</label>
                  <textarea
                    name="penalty_description"
                    className="form-control"
                    value={formData.penalty_description}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Launch Date */}
              <div className="mb-3">
                <label className="form-label">Launch Date</label>
                <input
                  name="launch_date"
                  type="date"
                  className="form-control"
                  value={formData.launch_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Availability Status */}
              <div className="mb-4">
                <label className="form-label">Availability Status</label>
                <select
                  name="availability_status"
                  className="form-select"
                  value={formData.availability_status}
                  onChange={handleChange}
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              {/* Submit */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Create Volunteer Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default VolunteerManagementServiceForm;

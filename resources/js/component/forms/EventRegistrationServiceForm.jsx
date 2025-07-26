import React, { useState } from "react";
import Breadcrumb from "../ui/Breadcrumb";
import { useAPI } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";

function EventRegistrationServiceForm() {
  const { postData } = useAPI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const initialState = {
    service_name: "",
    date: "",
    time: "",
    location: "",
    event_type: "Sport",
    reservation_type: "Individual",
    registration_start: "",
    registration_end: "",
    max_registrations: "",
    requirements: "",
    description: "",
    launch_date: "",
    availability_status: "Available",
    penalty_enabled: false,
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePenaltyChange = () => {
    setFormData((prev) => ({
      ...prev,
      penalty_enabled: !prev.penalty_enabled,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (
    //   !formData.service_name ||
    //   !formData.date ||
    //   !formData.location ||
    //   !formData.registration_start ||
    //   !formData.registration_end ||
    //   !formData.max_registrations ||
    //   !formData.requirements ||
    //   !formData.description ||
    //   !formData.launch_date
    // ) {
    //   setError("Please fill out all required fields.");
    //   return;
    // }

    setLoading(true);
    setError(null);

    try {
      const normalizedFormData = {
        ...formData,
        time:
          formData.time.length === 5 ? `${formData.time}:00` : formData.time,
        penalty_enabled: Boolean(formData.penalty_enabled),
        max_registrations: parseInt(formData.max_registrations),
      };

      await postData("ers", normalizedFormData); 

      setLoading(false);
      // setFormData(initialState);
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
            <h4 className="mb-0">Event Registration Service</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <input
                  name="service_name"
                  type="text"
                  className="form-control"
                  value={formData.service_name}
                  onChange={handleChange}
                  placeholder="Enter service name"
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Date</label>
                  <input
                    name="date"
                    type="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Time</label>
                  <input
                    name="time"
                    type="time"
                    className="form-control"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Event Type</label>
                <select
                  name="event_type"
                  className="form-select"
                  value={formData.event_type}
                  onChange={handleChange}
                >
                  <option>Sport</option>
                  <option>Seminar</option>
                  <option>Workshop</option>
                  <option>Educational Assistance</option>
                  <option>Online Tournament</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Registration Type</label>
                <select
                  name="reservation_type"
                  className="form-select"
                  value={formData.reservation_type}
                  onChange={handleChange}
                >
                  <option value="Individual">Individual</option>
                  <option value="Group">Group</option>
                </select>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <label className="form-label">Registration Start</label>
                  <input
                    name="registration_start"
                    type="date"
                    className="form-control"
                    value={formData.registration_start}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label">Registration End</label>
                  <input
                    name="registration_end"
                    type="date"
                    className="form-control"
                    value={formData.registration_end}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Maximum Registrations</label>
                <input
                  name="max_registrations"
                  type="number"
                  className="form-control"
                  value={formData.max_registrations}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Requirements</label>
                <input
                  name="requirements"
                  type="text"
                  className="form-control"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="e.g. ID card, registration form, fee receipt"
                />
              </div>

              <div className="mb-3 form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={formData.penalty_enabled}
                  onChange={handlePenaltyChange}
                  id="penaltySwitch"
                />
                <label className="form-check-label" htmlFor="penaltySwitch">
                  Penalty Policy:{" "}
                  {formData.penalty_enabled ? "Enabled" : "Disabled"}
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description..."
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Launch Date</label>
                <input
                  name="launch_date"
                  type="date"
                  className="form-control"
                  value={formData.launch_date}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Availability Status</label>
                <select
                  name="availability_status"
                  className="form-select"
                  value={formData.availability_status}
                  onChange={handleChange}
                >
                  <option>Available</option>
                  <option>Unavailable</option>
                </select>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg text-light"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Event Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventRegistrationServiceForm;

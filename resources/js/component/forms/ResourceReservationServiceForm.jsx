import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../ui/Breadcrumb";
import { useAPI } from "../contexts/ApiContext";
import { useNavigate } from "react-router-dom";

function ResourceReservationServiceForm({ serviceType }) {
  const { postData } = useAPI();
  const  navigate  = useNavigate();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    service_type: "Resource Reservation System",
    service_name: "",
    description: "",
    resource_name: "",
    available_resources: "",
    timeslot_duration: "30",
    max_reservation_per_timeslot: "",
    start_time: "",
    end_time: "",
    reservation_type: "Individual",
    individuals_per_reservation: "",
    min_group_size: "",
    max_group_size: "",
    booking_window: "",
    penalty_description: "",
    launch_date: "",
    availability_status: "Available",
  });

  const [timeslotEnabled, setTimeslotEnabled] = useState(true);
  const [penaltyEnabled, setPenaltyEnabled] = useState(true);

  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;
    const handleValidation = (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
      }
    };

    form.addEventListener("submit", handleValidation);
    return () => {
      form.removeEventListener("submit", handleValidation);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      service_type: "Resource Reservation System",
      service_name: "",
      description: "",
      resource_name: "",
      available_resources: "",
      timeslot_duration: "30 minutes",
      max_reservation_per_timeslot: "",
      start_time: "",
      end_time: "",
      reservation_type: "Individual",
      individuals_per_reservation: "",
      min_group_size: "",
      max_group_size: "",
      booking_window: "",
      penalty_description: "",
      launch_date: "",
      availability_status: "Available",
    });
    setTimeslotEnabled(false);
    setPenaltyEnabled(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      // available_resources: parseInt(formData.available_resources) || 0,
      max_reservation_per_timeslot: timeslotEnabled
        ? parseInt(formData.max_reservation_per_timeslot) || 0
        : null,
      individuals_per_reservation:
        formData.reservation_type === "Individual"
          ? parseInt(formData.individuals_per_reservation) || null
          : null,
      min_group_size:
        formData.reservation_type === "Group"
          ? parseInt(formData.min_group_size) || 0
          : null,
      max_group_size:
        formData.reservation_type === "Group"
          ? parseInt(formData.max_group_size) || 0
          : null,
      timeslot_enabled: timeslotEnabled,
      penalty_enabled: penaltyEnabled,
      penalty_description: penaltyEnabled ? formData.penalty_description : "",
    };
    try {
      await postData("rrs", payload, null, setLoading, setError);
      setAlertMessage("Service has been successfully published!");
      setShowAlert(true);
      resetForm();
      formRef.current.classList.remove("was-validated");
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        navigate("/admin/services/manage"); 
      }, 2000);
    } catch (err) {
      console.error("Submission error:", err);
      setAlertMessage("There was an error submitting the form.");
      setShowAlert(true);
    }
  };

  return (
    <>
      <Breadcrumb />

      <div className="container mt-5">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Resource Reservation System</h4>
          </div>
          <div className="card-body">
            {showAlert && (
              <div
                className={`alert alert-${
                  alertMessage.includes("successfully") ? "success" : "danger"
                } alert-dismissible fade show`}
                role="alert"
              >
                {alertMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAlert(false)}
                ></button>
              </div>
            )}

            <form
              noValidate
              className="needs-validation"
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label className="form-label">Service Name</label>
                <input
                  name="service_name"
                  type="text"
                  className="form-control"
                  value={formData.service_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  name="description"
                  type="text"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Name of Resource</label>
                <input
                  name="resource_name"
                  type="text"
                  className="form-control"
                  value={formData.resource_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Number of Available Resources
                </label>
                <input
                  name="available_resources"
                  type="number"
                  className="form-control"
                  value={formData.available_resources}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Timeslot Section */}
              <div className="mb-3 form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={timeslotEnabled}
                  onChange={() => setTimeslotEnabled(!timeslotEnabled)}
                  id="timeslotSwitch"
                />
                <label className="form-check-label" htmlFor="timeslotSwitch">
                  Timeslot Management:{" "}
                  {timeslotEnabled ? "Enabled" : "Disabled"}
                </label>
              </div>

              {timeslotEnabled && (
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Timeslot Duration</label>
                    <select
                      name="timeslot_duration"
                      className="form-select"
                      value={formData.timeslot_duration}
                      onChange={handleChange}
                      required
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Max Reservation per Timeslot
                    </label>
                    <input
                      name="max_reservation_per_timeslot"
                      type="number"
                      className="form-control"
                      value={formData.max_reservation_per_timeslot}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Start Time</label>
                    <input
                      name="start_time"
                      type="time"
                      className="form-control"
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">End Time</label>
                    <input
                      name="end_time"
                      type="time"
                      className="form-control"
                      value={formData.end_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Reservation Type */}
              <div className="mb-3">
                <label className="form-label">Reservation Type</label>
                <select
                  name="reservation_type"
                  className="form-select"
                  value={formData.reservation_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Individual">Individual</option>
                  <option value="Group">Group</option>
                </select>
              </div>

              {formData.reservation_type === "Individual" ? (
                <div className="mb-3">
                  <label className="form-label">
                    Number of Individuals Per Reservation
                  </label>
                  <input
                    name="individuals_per_reservation"
                    type="number"
                    className="form-control"
                    value={formData.individuals_per_reservation}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Minimum Group Size</label>
                    <input
                      name="min_group_size"
                      type="number"
                      className="form-control"
                      value={formData.min_group_size}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Maximum Group Size</label>
                    <input
                      name="max_group_size"
                      type="number"
                      className="form-control"
                      value={formData.max_group_size}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {/* Booking Window */}
              <div className="mb-3">
                <label className="form-label">Maximum Booking Window</label>
                <input
                  name="booking_window"
                  type="text"
                  className="form-control"
                  value={formData.booking_window}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Penalty Section */}
              <div className="mb-3 form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={penaltyEnabled}
                  onChange={() => setPenaltyEnabled(!penaltyEnabled)}
                  id="penaltySwitch"
                />
                <label className="form-check-label" htmlFor="penaltySwitch">
                  Penalty Policy: {penaltyEnabled ? "Enabled" : "Disabled"}
                </label>
              </div>

              {penaltyEnabled && (
                <div className="mb-3">
                  <label className="form-label">Penalty Description</label>
                  <textarea
                    name="penalty_description"
                    className="form-control"
                    rows="3"
                    value={formData.penalty_description}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* Launch Date and Status */}
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

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg text-light"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResourceReservationServiceForm;

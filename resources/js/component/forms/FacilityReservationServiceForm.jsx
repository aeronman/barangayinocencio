import React, { useState } from "react";
import Breadcrumb from "../ui/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useAPI } from "../contexts/ApiContext";

function FacilityReservationServiceForm() {
  const { postData } = useAPI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeslotEnabled, setTimeslotEnabled] = useState(true);
  const [penaltyEnabled, setPenaltyEnabled] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    facility_name:"",
    service_name: "",
    description: "",
    available_facilities: "",
    timeslot_duration: "30 minutes",
    max_reservation_per_timeslot: "",
    start_time: "",
    end_time: "",
    reservation_type: "Individual",
    individuals_per_reservation: "",
    min_group_size: "",
    max_group_size: "",
    booking_window: "",
    penalty_enabled: true,
    penalty_description: "",
    launch_date: "",
    availability_status: "Available",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "service_name",
      "launch_date",
      "available_facilities",
    ];
    const isValid = requiredFields.every((field) => formData[field]);

    if (!isValid) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setError(null);

      const payload = {
        ...formData,
        available_facilities: parseInt(formData.available_facilities) || 0,
        max_reservation_per_timeslot: timeslotEnabled
          ? parseInt(formData.max_reservation_per_timeslot) || 0
          : 0,
        start_time: timeslotEnabled ? formData.start_time : "00:00",
        end_time: timeslotEnabled ? formData.end_time : "23:59",
        timeslot_duration: timeslotEnabled
          ? formData.timeslot_duration
          : "30 minutes",
        penalty_enabled: penaltyEnabled,
        penalty_description: penaltyEnabled
          ? formData.penalty_description
          : null,
        individuals_per_reservation:
          formData.reservation_type === "Individual"
            ? parseInt(formData.individuals_per_reservation) || 0
            : null,
        min_group_size:
          formData.reservation_type === "Group"
            ? parseInt(formData.min_group_size) || 0
            : null,
        max_group_size:
          formData.reservation_type === "Group"
            ? parseInt(formData.max_group_size) || 0
            : null,
      };

      await postData("frs", payload, null, setLoading, setError);

      // Reset form
      setFormData({
        facility_name: "",
        service_name: "",
        description: "",
        available_facilities: "",
        timeslot_duration: "30 minutes",
        max_reservation_per_timeslot: "",
        start_time: "",
        end_time: "",
        reservation_type: "Individual",
        individuals_per_reservation: "",
        min_group_size: "",
        max_group_size: "",
        booking_window: "",
        penalty_enabled: true,
        penalty_description: "",
        launch_date: "",
        availability_status: "Available",
      });
      setTimeslotEnabled(true);
      setPenaltyEnabled(true);
      navigate("/admin/services/manage");
      
    } catch (err) {
      console.error("Submission Error:", err);
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="container mt-5">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Facility Reservation Service</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form noValidate onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Facility Name</label>
                <input
                  name="facility_name"
                  type="text"
                  className="form-control"
                  value={formData.facility_name}
                  onChange={handleChange}
                  placeholder="Enter facility name"
                  required
                />
              </div>

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

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Number of Available Facility(s)
                </label>
                <input
                  name="available_facilities"
                  type="number"
                  className="form-control"
                  value={formData.available_facilities}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      available_facilities: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="e.g. 3"
                />
              </div>

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
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Timeslot Duration</label>
                    <select
                      name="timeslot_duration"
                      className="form-select"
                      value={formData.timeslot_duration}
                      onChange={handleChange}
                    >
                      <option>30 minutes</option>
                      <option>1 hour</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label">
                      Max Reservation per Timeslot
                    </label>
                    <input
                      name="max_reservation_per_timeslot"
                      type="number"
                      className="form-control"
                      value={formData.max_reservation_per_timeslot}
                      onChange={handleChange}
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Start Time</label>
                    <input
                      name="start_time"
                      type="time"
                      className="form-control"
                      value={formData.start_time}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label">End Time</label>
                    <input
                      name="end_time"
                      type="time"
                      className="form-control"
                      value={formData.end_time}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Reservation Type</label>
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
                    placeholder="e.g. 3"
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
                      placeholder="e.g. 2"
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
                      placeholder="e.g. 10"
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label">Maximum Booking Window</label>
                <input
                  name="booking_window"
                  type="text"
                  className="form-control"
                  value={formData.booking_window}
                  onChange={handleChange}
                  placeholder="e.g. 1 week"
                />
              </div>

              <div className="mb-3 form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={penaltyEnabled}
                  onChange={() => {
                    const newValue = !penaltyEnabled;
                    setPenaltyEnabled(newValue);
                    setFormData((prev) => ({
                      ...prev,
                      penalty_enabled: newValue,
                    }));
                  }}
                  id="penaltySwitch"
                />
                <label className="form-check-label" htmlFor="penaltySwitch">
                  Penalty Policy: {penaltyEnabled ? "Enabled" : "Disabled"}
                </label>
              </div>

              <div className="mb-3">
                <label className="form-label">Penalty Description</label>
                <textarea
                  name="penalty_description"
                  className="form-control"
                  rows="3"
                  value={formData.penalty_description}
                  onChange={handleChange}
                  placeholder="Describe penalty policy here..."
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
                  className="btn text-light btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Create Facility Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default FacilityReservationServiceForm;

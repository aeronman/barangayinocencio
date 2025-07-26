import { useEffect, useRef, useState } from "react";
import { useAPI } from "./contexts/ApiContext";
import CustomCalendar from "./CustomCalendar";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";

function ComputerRentCalendar() {
  const { postData, getData } = useAPI();
  const [value, onChange] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationTimes, setReservationTimes] = useState([]);
  const [selectedPC, setSelectedPC] = useState(null);
  const [allPCs, setAllPCs] = useState([]);
  const [isMakingReservation, setIsMakingReservation] = useState(false);
  const [formData, setFormData] = useState({
    pc_number: "",
    time_range: "",
    name: "",
    address: "",
    email: "",
    contact: "",
    reservation_code: "",
  });
  const formRef = useRef(null);

  const timeOptions = [
    { slot: "08:00 AM - 10:00 AM" },
    { slot: "10:00 AM - 12:00 PM" },
    { slot: "01:00 PM - 03:00 PM" },
    { slot: "03:00 PM - 05:00 PM" },
    { slot: "05:00 PM - 07:00 PM" },
  ];

  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;

    const handleValidation = (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    };

    form.addEventListener("submit", handleValidation);

    return () => {
      form.removeEventListener("submit", handleValidation);
    };
  }, []);

  useEffect(() => {
    getData("available-resources/computer", setAllPCs, setLoading, setError);
    fetchReservations();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [value]);

  const fetchReservations = async () => {
    try {
      const data = await getData("computer-services");
      setReservations(data);
    } catch (err) {
      console.error("Fetch reservations failed", err);
    }
  };

  useEffect(() => {
    if (selectedPC) {
      const filtered = reservations?.filter(
        (res) => res.pc_number == selectedPC.id
      );
      const updated = timeOptions.map((option) => ({
        ...option,
        reserved: filtered.some((res) => res.time_range === option.slot),
      }));
      setReservationTimes(updated);
    }
  }, [selectedPC, reservations]);

  const handleCardClick = (pc) => {
    setSelectedPC(pc);
    Modal.getOrCreateInstance(
      document.getElementById("availableReservationModal")
    ).show();
  };

  const handleMarkReservation = () => {
    setFormData({
      pc_number: "",
      time_range: "",
      name: "",
      address: "",
      email: "",
      contact: "",
      reservation_code: "",
    });
    setIsMakingReservation(true);
    const reservationForm = document.getElementById("reservation-form");
    if (reservationForm) {
      reservationForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotClick = (slot) => {
    setFormData((prev) => ({
      ...prev,
      pc_number: selectedPC?.id || "",
      time_range: slot.slot,
    }));

    Modal.getOrCreateInstance(
      document.getElementById("reservationModal")
    ).show();

    Modal.getOrCreateInstance(
      document.getElementById("availableReservationModal")
    ).hide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "reservation_code") data.append(key, value);
    });
    data.append("reservation_date", value.toLocaleDateString("en-CA"));

    try {
      const response = await postData(
        "computer-services",
        data,
        null,
        setLoading,
        setError
      );

      const reservationCode = response?.reservation_code || "N/A";

      setFormData((prevData) => ({
        ...prevData,
        reservation_code: reservationCode,
      }));

      await fetchReservations();

      Modal.getInstance(document.getElementById("reservationModal"))?.hide();
      Modal.getOrCreateInstance(document.getElementById("successModal")).show();
    } catch (err) {
      setError(err?.message || "Failed to submit reservation.");
    } finally {
      setLoading(false);
    }
  };

  const localDate = value.toLocaleDateString("en-CA");
  const filteredPCs = allPCs.map((pc) => {
    const reservedSlots = reservations
      ?.filter(
        (res) => res.pc_number == pc.id && res.reservation_date === localDate
      )
      .map((res) => res.time_range);

    const isFull = timeOptions.every((option) =>
      reservedSlots?.includes(option.slot)
    );
    return { ...pc, status: isFull ? "full" : "available" };
  });

  const reservedates = reservations?.map((r) =>
    new Date(r.reservation_date).toLocaleDateString("en-CA")
  );

  return (
    <>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card rounded-4 shadow-lg border-0 h-100">
            <div className="card-header bg-primary text-white text-center rounded-top-4">
              <h2 className="mb-0 fw-bold">
                <i className="bi bi-calendar-event me-2" />
                Computer Rental Calendar
              </h2>
            </div>
            <div className="card-body p-4">
              <CustomCalendar
                onChange={onChange}
                value={value}
                eventDates={reservedates}
                hasPastDates={false}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card rounded-4 shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center rounded-top-4">
              <h4 className="mb-0 fw-semibold">
                {value.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
            </div>
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <button
                className="btn btn-outline-primary w-100 fw-bold"
                onClick={handleMarkReservation}
              >
                <i className="bi bi-check-circle me-2" />
                Mark Reservation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 pb-5">
        {!isMakingReservation && (
          <div className="row g-4 justify-content-center">
            {filteredPCs.map((pc, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                onClick={() => handleCardClick(pc)}
                style={{ cursor: "pointer" }}
              >
                <div className="card text-center shadow-lg border-0 rounded-4 h-100 hover-shadow">
                  <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                    <i
                      className={`bi bi-pc-display display-3 mb-3 ${
                        pc.status === "full" ? "text-danger" : "text-success"
                      }`}
                    ></i>
                    <h5 className="card-title fw-semibold mb-2">{pc.name}</h5>
                    <span
                      className={`badge rounded-pill fs-6 px-3 py-2 ${
                        pc.status === "full"
                          ? "bg-danger-subtle text-danger"
                          : "bg-success-subtle text-success"
                      }`}
                    >
                      {pc.status === "full" ? "Full Slot" : "Available"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isMakingReservation && (
          <div className="d-flex flex-column container w-75 border p-4 rounded-4 shadow-lg">
            <div className="d-flex justify-content-center align-items-center">
              <h5 className="mb-0">
                Make Reservation for{" "}
                {value.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h5>
            </div>

            <div className="">
              {error && (
                <div className="alert alert-danger">
                  {typeof error === "string" ? error : "An error occurred."}
                </div>
              )}

              <form
                className="needs-validation"
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
                id="reservation-form"
              >
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label">PC Number</label>
                    <select
                      className="form-select"
                      name="pc_number"
                      value={formData.pc_number}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select PC --</option>
                      {filteredPCs.map((pc, index) => {
                        const isPCFullyBooked = pc.status === "full";

                        return (
                          <option
                            key={index}
                            value={pc.id}
                            disabled={isPCFullyBooked}
                          >
                            {pc.name || `PC ${pc.id}`}{" "}
                            {isPCFullyBooked && "(Fully Booked)"}
                          </option>
                        );
                      })}
                    </select>
                    <div className="invalid-feedback">Please select a PC.</div>
                  </div>
                </div>
                {formData.pc_number ? (
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label className="form-label">Time Range</label>
                      <select
                        className="form-select"
                        name="time_range"
                        value={formData.time_range}
                        onChange={handleInputChange}
                        required
                      >
                        <option className="text-dark" value="">
                          -- Select Time --
                        </option>
                        {timeOptions.map((range, index) => {
                          const isReserved = reservations?.some(
                            (res) =>
                              res.pc_number === formData.pc_number &&
                              res.reservation_date ===
                                value.toLocaleDateString("en-CA") &&
                              res.time_range === range.slot
                          );

                          return (
                            <option
                              key={index}
                              value={range.slot}
                              disabled={isReserved}
                            >
                              {range.slot} {isReserved ? "(Reserved)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <div className="invalid-feedback">
                        Please select a time range.
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {formData.time_range ? (
                  <>
                    {["name", "address", "email", "contact"].map(
                      (field, index) => (
                        <div className="mb-3" key={index}>
                          <label className="form-label">
                            {field === "contact"
                              ? "Contact Number"
                              : field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type={field === "email" ? "email" : "text"}
                            className="form-control"
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter a valid{" "}
                            {field === "contact" ? "contact number" : field}.
                          </div>
                        </div>
                      )
                    )}

                    <div className="d-flex">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Reserve"}
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      <div
        className="modal fade"
        id="availableReservationModal"
        tabIndex="-1"
        aria-labelledby="reservationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title" id="reservationModalLabel">
                {selectedPC
                  ? `Reservations for ${selectedPC.name}`
                  : "Reservation Times"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {reservationTimes.length === 0 ? (
                <p className="text-center text-muted">
                  <i className="bi bi-info-circle me-2"></i>No time slots
                  available.
                </p>
              ) : (
                <ul className="list-group">
                  {reservationTimes.map((slot, index) => {
                    const reservedRes = reservations?.find(
                      (res) =>
                        res.pc_number == selectedPC?.id &&
                        res.reservation_date === value &&
                        res.time_range === slot.slot
                    );
                    
                    return (
                      <li
                        key={index}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                          slot.reserved && !reservedRes
                            ? "list-group-item-danger"
                            : "list-group-item-success"
                        } ${!slot.reserved ? "clickable" : ""}`}
                        style={{
                          cursor: !slot.reserved && !reservedRes ? "pointer" : "not-allowed",
                        }}
                        onClick={() => {
                          if (!slot.reserved) {
                            handleSlotClick(slot);
                          }
                        }}
                        disabled={reservedRes}
                      >
                        {slot.slot}
                        <span
                          className={`badge bg-${
                            slot.reserved ? "danger" : "success"
                          }`}
                        >
                          {slot.reserved ? "Reserved" : "Available"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="reservationModal"
        tabIndex="-1"
        aria-labelledby="reservationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="reservationModalLabel">
                Reserve a Computer
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <p className="fw-bold mb-4">
                Selected Date:{" "}
                {value.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {error && (
                <div className="alert alert-danger">
                  {typeof error === "string" ? error : "An error occurred."}
                </div>
              )}
              <form
                className="needs-validation"
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">PC Number</label>
                    <select
                      className="form-select"
                      name="pc_number"
                      value={formData.pc_number}
                      onChange={handleInputChange}
                      disabled
                      required
                    >
                      <option value="">-- Select PC --</option>
                      {filteredPCs.map((pc, index) => (
                        <option key={index} value={pc.id}>
                          {pc.name || `PC ${pc.id}`}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">Please select a PC.</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Time Range</label>
                    <select
                      className="form-select"
                      name="time_range"
                      value={formData.time_range}
                      onChange={handleInputChange}
                      disabled
                      required
                    >
                      <option value="">-- Select Time Slot --</option>
                      {timeOptions.map((option, index) => (
                        <option key={index} value={option.slot}>
                          {option.slot}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please select a Time Slot.
                    </div>

                    <div className="invalid-feedback">
                      Please select a time range.
                    </div>
                  </div>
                </div>

                {["name", "address", "email", "contact"].map((field, index) => (
                  <div className="mb-3" key={index}>
                    <label className="form-label">
                      {field === "contact"
                        ? "Contact Number"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      className="form-control"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="invalid-feedback">
                      Please enter a valid{" "}
                      {field === "contact" ? "contact number" : field}.
                    </div>
                  </div>
                ))}

                <div className="modal-footer px-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Reservation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        id="successModal"
        aria-labelledby="successModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="successModalLabel">
                Reservation Successful
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Your reservation was successful. Please check your email for
                confirmation.
              </p>
              <p>
                <strong>Reservation Code:</strong>{" "}
                <span className="text-primary">
                  {formData.reservation_code}
                </span>
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => setTimeout(() => window.location.reload(), 500)}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComputerRentCalendar;

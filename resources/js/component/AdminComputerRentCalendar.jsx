import { useEffect, useRef, useState } from "react";
import { useAPI } from "./contexts/ApiContext";
import CustomCalendar from "./CustomCalendar";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";

function AdminComputerRentCalendar() {
  const navigate = useNavigate();
  const { deleteData, getData, putData } = useAPI();
  const [value, onChange] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationTimes, setReservationTimes] = useState([]);
  const [selectedPC, setSelectedPC] = useState(null);
  const [allPCs, setAllPCs] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const formattedDate = value.toLocaleDateString("en-CA");

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
    return () => form.removeEventListener("submit", handleValidation);
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
      const filtered = reservations.filter(
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

  const filteredPCs = allPCs.map((pc) => {
    const pcReservations = reservations.filter(
      (res) => res.pc_number == pc.id && res.reservation_date === formattedDate
    );

    const reservedSlots = pcReservations.map((res) => res.time_range);

    const isFull = timeOptions.every((option) =>
      reservedSlots.includes(option.slot)
    );

    return {
      ...pc,
      reservationCount: pcReservations.length,
      status: isFull ? "full" : "available",
    };
  });

  const reservedDates = reservations.map((r) =>
    new Date(r.reservation_date).toLocaleDateString("en-CA")
  );

  const totalReservationsForSelectedDate = reservations.filter(
    (res) => res.reservation_date === formattedDate
  ).length;

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      await deleteData(`computer-services/${selectedReservation.id}`);
      Modal.getInstance(document.getElementById("previewModal")).hide();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  };

  const handleMarkAsDone = async () => {
    if (!selectedReservation) return;

    try {
      await putData(
        `computer-services/${selectedReservation.id}/mark-as-done`
      );
      Modal.getInstance(document.getElementById("previewModal")).hide();
    } catch (error) {
      console.error("Failed to mark reservation as done:", error);
    }
  };

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
                eventDates={reservedDates}
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
              <ul className="list-group list-group-flush flex-grow-1 mb-3 px-4 row text-center">
                <li className="list-group-item text-start fw-semibold fs-5">
                  Total Reservations: {totalReservationsForSelectedDate}
                </li>

                {filteredPCs.length === 0 ? (
                  <li className="list-group-item text-center text-muted fst-italic">
                    <i className="bi bi-info-circle me-2" />
                    No PCs available.
                  </li>
                ) : (
                  <>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-3 py-2 fw-bold">
                      <span className="col-6">PC Name</span>
                      <span className="col-6">No. of Reservations</span>
                    </li>
                    {filteredPCs.map((pc, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center px-3 py-2"
                      >
                        <span className="col-6">
                          {pc.name || `PC ${pc.id}`}
                        </span>
                        <span className="col-6">{pc.reservationCount}</span>
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 container text-center">
        <button
          onClick={() => {
            navigate("weekly-report");
          }}
          className="btn btn-lg fs-3 btn-primary"
        >
          Weekly Report
        </button>
      </div>

      <div className="container mt-5 pb-5">
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
      </div>

      <div
        className="modal fade"
        id="availableReservationModal"
        tabIndex="-1"
        aria-labelledby="reservationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5
                className="modal-title text-capitalize"
                id="reservationModalLabel"
              >
                {selectedPC
                  ? `${selectedPC.name} ${selectedPC.status}`
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
                <div className="table-responsive">
                  <table className="table table-bordered text-center align-middle">
                    <thead
                      style={{ backgroundColor: "#3c78d8", color: "white" }}
                    >
                      <tr>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationTimes.map((slot, index) => {
                        const reservedRes = reservations.find(
                          (res) =>
                            res.pc_number == selectedPC?.id &&
                            res.reservation_date === formattedDate &&
                            res.time_range === slot.slot
                        );

                        const nameDetails =
                          slot.reserved && reservedRes ? (
                            <>
                              <strong>Name:</strong> {reservedRes.name} <br />
                              <strong>Code:</strong>{" "}
                              {reservedRes.reservation_code}
                            </>
                          ) : (
                            "Available"
                          );

                        return (
                          <tr
                            key={index}
                            className={`text-center ${
                              slot.reserved && reservedRes ? "table-danger" : ""
                            }`}
                          >
                            <td>{slot.slot}</td>
                            <td>
                              {slot.reserved && reservedRes
                                ? "Reserved"
                                : "Available"}
                            </td>
                            <td className="">{nameDetails}</td>
                            <td className="">
                              <button
                                className="btn btn-primary btn-sm"
                                data-bs-dismiss="modal"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (reservedRes) {
                                    setSelectedReservation(reservedRes);
                                    const modal = new Modal(
                                      document.getElementById(
                                        "previewModal"
                                      )
                                    );
                                    modal.show();
                                  }
                                }}
                                disabled={!reservedRes}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="previewModal"
        tabIndex="-2"
        aria-labelledby="reservationDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5
                className="modal-title text-capitalize"
                id="reservationModalLabel"
              >
                <strong>PC-{selectedReservation?.pc_number}</strong> |{" "}
                {selectedReservation?.time_range}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedReservation && (
                <div className="d-flex justify-content-between align-items-start">
                  <div className="p-3 col-8">
                    <div className="border shadow rounded-4 p-4">
                      <p>
                        <strong>Name</strong>
                        <br />
                        {selectedReservation.name}
                      </p>
                      <p>
                        <strong>Reservation Code</strong>
                        <br />
                        {selectedReservation.reservation_code}
                      </p>
                      <p>
                        <strong>Address</strong>
                        <br />
                        {selectedReservation.address}
                      </p>
                      <p>
                        <strong>Email</strong>
                        <br />
                        {selectedReservation.email}
                      </p>
                      <p>
                        <strong>Contact Number</strong>
                        <br />
                        {selectedReservation.contact}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 col-4">
                    <div className="text-center border shadow rounded-4 p-4">
                      <p className="fw-bold">Status</p>
                      <div
                        className={`p-2 mb-2 text-white rounded ${
                          selectedReservation.status === "completed"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {selectedReservation.status === "completed"
                          ? "Completed"
                          : "Pending"}
                      </div>

                      {/* <button
                        className="btn btn-success text-light btn-sm mb-2"
                        onClick={() => {
                          setModalAction("done");
                          const modal = new Modal(
                            document.getElementById("cancelConfirmationModal")
                          );
                          modal.show();
                        }}
                      >
                        Mark as Done
                      </button> */}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setModalAction("cancel");
                          const modal = new Modal(
                            document.getElementById("cancelConfirmationModal")
                          );
                          modal.show();
                        }}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="cancelConfirmationModal"
        tabIndex="-1"
        aria-labelledby="cancelConfirmationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header rounded-top-4">
              <h5 className="modal-title" id="cancelConfirmationModalLabel">
                Confirm Cancellation
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <p>Are you sure you want to cancel this reservation?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No, Keep It
              </button>
              <button
                type="button"
                className={`btn ${
                  modalAction === "done"
                    ? "btn-success text-light"
                    : "btn-danger"
                }`}
                onClick={() => {
                  if (modalAction === "cancel") {
                    handleCancelReservation();
                  } else if (modalAction === "done") {
                    handleMarkAsDone();
                  }
                }}
                data-bs-dismiss="modal"
              >
                {modalAction === "done"
                  ? "Yes, Mark as Done"
                  : "Yes, Cancel It"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminComputerRentCalendar;

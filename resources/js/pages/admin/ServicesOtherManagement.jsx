import { useEffect, useState } from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useLocation, useNavigate } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";
import Breadcrumb from "../../component/ui/Breadcrumb";
import CustomCalendar from "../../component/CustomCalendar";

function ServicesOtherManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = location.pathname.split("/").pop();

  const { getData } = useAPI();

  const [value, onChange] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [reservationTimes, setReservationTimes] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [allResources, setAllResources] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);

  const [error, setError] = useState(null);

  const formattedDate = value.toLocaleDateString("en-CA");

  const timeOptions = [
    { slot: "08:00 AM - 10:00 AM" },
    { slot: "10:00 AM - 12:00 PM" },
    { slot: "01:00 PM - 03:00 PM" },
    { slot: "03:00 PM - 05:00 PM" },
    { slot: "05:00 PM - 07:00 PM" },
  ];

  const slugify = (str) => str.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    getData("rrs", setServices, setLoadingServices, setError);
    getData(
      "other-services",
      setReservations,
      setLoadingReservations,
      setError
    );
  }, []);

  useEffect(() => {
    if (selectedService) {
      getData(
        `available-resources/rrs/${selectedService.id}`,
        setAllResources,
        setLoadingResources,
        setError
      );
    }
  }, [selectedService]);

  useEffect(() => {
    if (services.length > 0) {
      const matched = services.find(
        (service) => slugify(service.service_name) === slug
      );
      setSelectedService(matched);
    }
  }, [services, slug]);

  useEffect(() => {
    if (selectedResource) {
      const filtered = reservations.filter(
        (res) =>
          res.resource_number == selectedResource.id &&
          res.reservation_date == formattedDate
      );

      const updated = timeOptions.map((option) => ({
        ...option,
        reserved: filtered.some((res) => res.time_range == option.slot),
      }));
      setReservationTimes(updated);
    }
  }, [selectedResource, reservations, formattedDate]);

  const filteredResources = allResources.map((resource) => {
    const resourceReservations = reservations.filter((res) => {
      return (
        res.resource_number == resource.id &&
        res.reservation_date === formattedDate
      );
    });

    const reservedSlots = resourceReservations.map((res) => res.time_range);

    const isFull = timeOptions.every((option) =>
      reservedSlots.includes(option.slot)
    );

    return {
      ...resource,
      reservationCount: resourceReservations.length,
      status: isFull ? "full" : "available",
    };
  });

  const handleCardClick = (resource) => {
    setSelectedResource(resource);
    Modal.getOrCreateInstance(
      document.getElementById("availableReservationModal")
    ).show();
  };

  const reservedDates = reservations.map((r) =>
    new Date(r.reservation_date).toLocaleDateString("en-CA")
  );

  const totalReservationsForSelectedDate = reservations.filter(
    (res) => res.reservation_date === formattedDate
  ).length;

  if (loadingServices || loadingReservations || loadingResources) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <>
      <Breadcrumb />

      <div className="container mt-5 pb-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card rounded-4 shadow-lg border-0 h-100">
              <div className="card-header bg-primary text-white text-center rounded-top-4">
                <h2 className="mb-0 fw-bold">
                  {/* <i className="bi bi-calendar-event me-2" /> */}
                  {selectedService?.service_name} Calendar
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

                  {filteredResources.length === 0 ? (
                    <li className="list-group-item text-center text-muted fst-italic">
                      <i className="bi bi-info-circle me-2" />
                      No Resources available.
                    </li>
                  ) : (
                    <>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-3 py-2 fw-bold">
                        <span className="col-6">Resource Name</span>
                        <span className="col-6">No. of Reservations</span>
                      </li>
                      {filteredResources.map((resource, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center px-3 py-2"
                        >
                          <span className="col-6">
                            {resource.name || `Resource ${resource.id}`}
                          </span>
                          <span className="col-6">
                            {resource.reservationCount}
                          </span>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-5 pb-5">
          <div className="row g-4 justify-content-center">
            {filteredResources.map((resource, index) => (
              <div
                key={index}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                onClick={() => handleCardClick(resource)}
                style={{ cursor: "pointer" }}
              >
                <div className="card text-center shadow-lg border-0 rounded-4 h-100 hover-shadow">
                  <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                    <i
                      className={`bi bi-collection-fill display-3 mb-3 ${
                        resource.status === "full"
                          ? "text-danger"
                          : "text-success"
                      }`}
                    ></i>
                    <h5 className="card-title fw-semibold mb-2">
                      {resource.name}
                    </h5>
                    <span
                      className={`badge rounded-pill fs-6 px-3 py-2 ${
                        resource.status === "full"
                          ? "bg-danger-subtle text-danger"
                          : "bg-success-subtle text-success"
                      }`}
                    >
                      {resource.status === "full" ? "Full Slot" : "Available"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <h5 className="modal-title text-capitalize">
                {selectedResource?.name}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
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
                  <table className="table table-bordered text-center">
                    <thead
                      style={{ backgroundColor: "#3c78d8", color: "white" }}
                    >
                      <tr>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Reservation</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservationTimes.map((slot, index) => {
                        const reservedRes = reservations.find(
                          (res) =>
                            res.resource_number == selectedResource?.id &&
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
                                        "reservationDetailModal"
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

      {/* Reservation Detail Modal */}
      <div
        className="modal fade"
        id="reservationDetailModal"
        tabIndex="-1"
        aria-labelledby="reservationDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title">
                {selectedReservation?.resource_name} -{" "}
                {selectedReservation?.resource_number} |{" "}
                {selectedReservation?.time_range}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {selectedReservation && (
                <div className="d-flex justify-content-between">
                  <div className="col-8 p-3">
                    <div className="border shadow rounded-4 p-4">
                      <p>
                        <strong>Name:</strong> {selectedReservation.name}
                      </p>
                      <p>
                        <strong>Code:</strong>{" "}
                        {selectedReservation.reservation_code}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedReservation.address}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedReservation.email}
                      </p>
                      <p>
                        <strong>Contact:</strong> {selectedReservation.contact}
                      </p>
                    </div>
                  </div>
                  <div className="col-4 p-3 text-center">
                    <div className="border shadow rounded-4 p-4">
                      <p className="fw-bold">Status</p>
                      <div
                        className={`p-2 mb-2 text-white rounded ${
                          selectedReservation.status === "Completed"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {selectedReservation.status}
                      </div>
                      <button className="btn btn-outline-danger btn-sm">
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
    </>
  );
}

export default ServicesOtherManagement;

import React, { useState, useEffect } from "react";
import CustomCalendar from "./CustomCalendar";
import { useAPI } from "./contexts/ApiContext";

function AdminPrintingScheduleCalendar() {
  const [value, setValue] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getData } = useAPI();

  useEffect(() => {
    const fetchReservationsByDate = async () => {
      const selectedDate = value.toLocaleDateString("en-CA");
      setLoading(true);
      await getData(
        `printing-services?date=${selectedDate}`,
        setReservations,
        setLoading
      );
    };

    fetchReservationsByDate();
  }, [value]);

  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    const fetchAllReservationDates = async () => {
      await getData("printing-services", (data) => {
        const dates = data.map((r) =>
          new Date(r.reservation_date).toLocaleDateString("en-CA")
        );
        setReservedDates(dates);
      });
    };

    fetchAllReservationDates();
  }, []);

  return (
    <div className="mb-5" id="calendar-section">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card rounded-4 shadow-lg border-0 h-100">
            <div className="card-header bg-gradient bg-primary text-white text-center rounded-top-4 py-3">
              <h2 className="mb-0 fw-bold">Printing Schedule Calendar</h2>
            </div>
            <div className="card-body p-4">
              <CustomCalendar
                onChange={setValue}
                value={value}
                eventDates={reservedDates}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card rounded-4 shadow-lg border-0 h-100">
            <div className="card-header bg-gradient bg-primary text-white text-center rounded-top-4 py-3">
              <h4 className="mb-0 fw-semibold">
                {value.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
            </div>
            <div className="card-body p-4">
              {loading ? (
                <div
                  className="d-flex flex-column justify-content-center align-items-center calendar-loading-overlay"
                  style={{ minHeight: "400px" }}
                >
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted fw-semibold">
                    Loading printing reservations...
                  </p>
                </div>
              ) : (
                <>
                  {reservations.length === 0 ? (
                    <div className="text-center text-muted fst-italic">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                        alt="No events"
                        style={{ width: "80px", opacity: 0.4 }}
                        className="mb-3"
                      />
                      <p>No scheduled prints for this date.</p>
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {reservations.map((reservation, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex align-items-start gap-3 border-0 px-4 py-3"
                        >
                          <div className="flex-shrink-0">
                            <div
                              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i className="bi bi-printer-fill fs-5"></i>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold text-dark">
                              {reservation.name || "Untitled Request"}
                            </h6>
                            {reservation.status && (
                              <small className="text-muted d-block">
                                <i className="bi bi-info-circle me-1"></i>
                                {reservation.status}
                              </small>
                            )}
                            {reservation.reservation_code && (
                              <small className="text-muted d-block">
                                <i className="bi bi-hash me-1"></i>
                                {reservation.reservation_code}
                              </small>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPrintingScheduleCalendar;

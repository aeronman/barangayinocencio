import { useEffect, useRef, useState } from "react";
import { useAPI } from "./contexts/ApiContext";
import CustomCalendar from "./CustomCalendar";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";

function AdminPrintingScheduleCalendar() {
  const navigate = useNavigate();
  const { deleteData, getData } = useAPI();
  const [value, onChange] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationTimes, setReservationTimes] = useState([]);
  const [selectedPC, setSelectedPC] = useState(null);
  const [allPrinters, setAllPrinters] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);

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
    getData(
      "available-resources/printing",
      setAllPrinters,
      setLoading,
      setError
    );
    fetchReservations();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [value]);

  const fetchReservations = async () => {
    try {
      const data = await getData("printing-services");
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

  const filteredPrinters = allPrinters.map((printer) => {
    const printerReservations = reservations.filter(
      (res) => res.id == printer.id && res.reservation_date === formattedDate
    );

    const reservedSlots = printerReservations.map((res) => res.time_range);

    const isFull = timeOptions.every((option) =>
      reservedSlots.includes(option.slot)
    );

    return {
      ...printer,
      reservationCount: printerReservations.length,
      status: isFull ? "full" : "available",
    };
  });

  const reservedDates = reservations.map((r) =>
    new Date(r.reservation_date).toLocaleDateString("en-CA")
  );

  const totalReservationsForSelectedDate = reservations.filter(
    (res) => res.reservation_date === formattedDate
  ).length;


  return (
    <>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card rounded-4 shadow-lg border-0 h-100">
            <div className="card-header bg-primary text-white text-center rounded-top-4">
              <h2 className="mb-0 fw-bold">
                <i className="bi bi-calendar-event me-2" />
                Printing Schedule Calendar
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

                {filteredPrinters.length === 0 ? (
                  <li className="list-group-item text-center text-muted fst-italic">
                    <i className="bi bi-info-circle me-2" />
                    No Printing available.
                  </li>
                ) : (
                  <>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-3 py-2 fw-bold">
                      <span className="col-6">Printer Name</span>
                      <span className="col-6">No. of Reservations</span>
                    </li>

                    {filteredPrinters.map((printer, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center px-3 py-2"
                      >
                        <span className="col-6">
                          {printer.name || `Printer ${printer.id}`}
                        </span>
                        <span className="col-6">
                          {printer.reservationCount}
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

    </>
  );
}

export default AdminPrintingScheduleCalendar;

import React, { useState, useEffect } from "react";
import CustomCalendar from "./CustomCalendar";
import { useAPI } from "./contexts/ApiContext";

function Calendar() {
  const [value, setValue] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventDates, setEventDates] = useState([]);
  const { getData } = useAPI();

  const formattedDate = value.toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchAllEventsForDate = async () => {
      setLoading(true);
      let allEvents = [];

      const fetchTypes = [
        { endpoint: "events", type: "event" },
        { endpoint: "computer-services", type: "computer" },
        { endpoint: "printing-services", type: "printing" },
      ];

      for (const { endpoint, type } of fetchTypes) {
        await getData(`${endpoint}?date=${formattedDate}`, (data) => {
          const taggedData = data.map((item) => ({ ...item, type }));
          allEvents = [...allEvents, ...taggedData];
        });
      }

      setSelectedDateEvents(allEvents);
      setLoading(false);
    };

    fetchAllEventsForDate();
  }, [formattedDate]);

  useEffect(() => {
    const fetchAllEventDates = async () => {
      const endpoints = [
        { url: "events", dateKey: "date" },
        { url: "computer-services", dateKey: "reservation_date" },
        { url: "printing-services", dateKey: "reservation_date" },
      ];
  
      const allDates = new Set();
  
      await Promise.all(
        endpoints.map(({ url, dateKey }) =>
          getData(url, (data) => {
            data.forEach((item) => {
              const dateStr = new Date(item[dateKey]).toLocaleDateString("en-CA");
              allDates.add(dateStr);
            });
          })
        )
      );
  
      setEventDates(Array.from(allDates));
    };
  
    fetchAllEventDates();
  }, []);
  
  

  const renderEventSection = (type, label) => {
    const filtered = selectedDateEvents.filter((event) => event.type === type);

    // if (filtered.length === 0) return null;

    return (
      <div className="" key={type}>
        <h4 className="fw-semibold pb-2">
          <span className="text-muted fs-5">{label}</span> : {filtered.length}
        </h4>
      </div>
    );
  };

  return (
    <div className="mb-5" id="calendar-section">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card rounded-4 shadow-lg border-0 h-100">
            <div className="card-header bg-gradient bg-primary text-white text-center rounded-top-4 py-3">
              <h2 className="mb-0 fw-bold">Calendar</h2>
            </div>
            <div className="card-body p-4">
              <CustomCalendar
                onChange={setValue}
                value={value}
                eventDates={eventDates}
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
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{ minHeight: "400px" }}
                >
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted fw-semibold">
                    Loading calendar events...
                  </p>
                </div>
              ) : selectedDateEvents.length === 0 ? (
                <div className="text-center text-muted fst-italic">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                    alt="No events"
                    style={{ width: "80px", opacity: 0.4 }}
                    className="mb-3"
                  />
                  <p>No events for this date.</p>
                </div>
              ) : (
                <>
                  <div className="d-flex flex-column justify-content-center p-3">
                    {renderEventSection("event", "Events")}
                    {renderEventSection("computer", "Computer Reservations")}
                    {renderEventSection("printing", "Printing Reservations")}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;

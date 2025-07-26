import React, { useEffect, useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import ParticipantsTable from "../../component/tables/ParticipantsTable";
import { useAPI } from "../../component/contexts/ApiContext";

function EventsParticipantsManagement() {
  const { getData } = useAPI();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

 useEffect(() => {
  const fetchEvents = async () => {
    setLoading(true);
    try {
      await getData("events?sort=published", setEventsData, setLoading, setError);
    } catch (err) {
      setError("Error fetching events");
      setLoading(false);
    }
  };
  fetchEvents();
}, [getData]);


  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowTable(true);
  };

  const handleBack = () => {
    setShowTable(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted fw-semibold">Fetching events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb />
      <div className="container py-5">
        {showTable && selectedEvent ? (
          <>
            <div className="text-start mb-3">
              <button
                onClick={handleBack}
                className="btn btn-outline-primary py-1"
              >
                <i className="bi bi-arrow-left-short"></i> Back
              </button>
            </div>
            <ParticipantsTable
              eventName={selectedEvent.title}
              eventId={selectedEvent.id}
              registrationType={selectedEvent.registration_type}
              hasActions={true}
            />
          </>
        ) : (
          <div>
            {eventsData.length > 0 ? (
              <div className="row g-4">
                {eventsData.map((event, index) => (
                  <div className="col-md-6 col-lg-4" key={index}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEventClick(event)}
                      className="card h-100 shadow-sm rounded-4 hover-shadow transition p-4 border-0 shadow-lg"
                    >
                      <div className="card-body text-center">
                        <h4 className="fw-bold text-dark">{event?.title}</h4>
                        <p className="text-muted mt-2">
                          Number of Participants:
                          <span className="fw-bold text-primary ms-2">
                            {(event?.participants?.length ?? 0) +
                              (event?.teams?.length ?? 0)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted fst-italic">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                  alt="No events"
                  style={{ width: "80px", opacity: 0.4 }}
                  className="mb-3"
                />
                <p>No events found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default EventsParticipantsManagement;

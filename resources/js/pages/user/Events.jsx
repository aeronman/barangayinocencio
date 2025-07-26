import React, { useState, useEffect } from "react";
import Carousel from "../../component/Caroucel";
import { Link, useLocation } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";

const EventsCard = ({ events }) => {
  const { id, title, description, date, images } = events;

  return (
    <div
      className="events-card card border-0 shadow-lg rounded-4 mb-4 p-0"
      data-date={date.substring(0, 7)}
    >
      <div className="row g-0 align-items-stretch">
        <div className="col-md-2">
          <img
            src={
              images[0] &&
              (images[0].startsWith("http") || images[0].startsWith("blob:")
                ? images[0]
                : `/storage/${images[0]}`)
            }
            className="w-100 h-100 object-fit-cover rounded-start"
            alt="Events"
          />
        </div>
        <div className="col-md-8 d-flex flex-column p-4">
          <div>
            <h5 className="card-title fw-bold">{title}</h5>
            <p className="small text-muted fw-bold">
              Date:{" "}
              <span className="date">
                {new Date(date).toLocaleDateString()}
              </span>
            </p>
            <p>{description.slice(0, 100)}...</p>
          </div>
          <div className="d-flex align-items-center mt-auto justify-content-between">
            <Link
              to={`/events/${id}`}
              className="fw-bold text-primary text-decoration-none"
            >
              View full events
            </Link>
            <Link
              to={`/registration/${id}`}
              className="btn btn-primary rounded-pill px-4 py-1 read-more-btn"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="col-md-2 d-flex align-items-center p-3">
          <div className="h-100 w-100 shadow-lg rounded-4 bg-opacity-50 text-dark d-flex justify-content-center align-items-center flex-column fw-bold py-3">
            <div className="fs-3">
              {new Date(date).toLocaleString("default", { month: "long" })}
            </div>
            <div className="fs-1">{new Date(date).getDate()}</div>
            <div className="fs-3">{new Date(date).getFullYear()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Events({ isFullPage = true }) {
  const { getData } = useAPI();
  const location = useLocation();

  const [eventsList, setEventsList] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData("carousel?page=events", setCarouselItems, setLoading, setError);
  }, [getData]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const defaultFilter = `${year}-${month}`;
    setFilterDate(defaultFilter);

    const fetchData = async () => {
      try {
        const data = await getData("events?sort=published");
        setEventsList(data);

        if (isFullPage) {
          const filtered = data.filter(
            (events) => events.date.substring(0, 7) === defaultFilter
          );
          setFilteredEvents(filtered);
        } else {
          setFilteredEvents(data.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getData, isFullPage]);

  useEffect(() => {
    const handleManualFilter = () => {
      const filtered = eventsList.filter((n) => {
        const formattedDate = new Date(n.date)
          .toISOString()
          .slice(0, 7);
        return formattedDate === filterDate;
      });
      setFilteredEvents(filtered);
    };

    if (isFullPage && eventsList.length > 0 && filterDate) {
      handleManualFilter();
    }
  }, [eventsList, filterDate, isFullPage]);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilterDate(selected);
  };

  if (loading) return null;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <>
      {isFullPage && <Carousel carouselItems={carouselItems} />}

      <div className="container pb-5">
        {isFullPage ? (
          <div className="input-group mb-4 mt-5" style={{ maxWidth: "300px" }}>
            <input
              type="month"
              className="form-control"
              value={filterDate}
              onChange={handleFilterChange}
            />
          </div>
        ) : (
          <div className="container text-center my-5">
            <h5 className="section-title text-primary">Latest Events</h5>
            <h2 className="main-heading mt-3 text-dark">
              Get the Latest <br /> Events & Announcements
            </h2>
            <p className="sub-text mt-3">
              Stay informed about community projects, public service
              information, and updates from the Sangguniang Kabataan of Barangay
              Inocencio.
            </p>
          </div>
        )}

        <div className="row g-4">
          {filteredEvents.length > 0 ? (
            filteredEvents
              .map((events, index) => (
                <EventsCard key={index} events={events} />
              ))
          ) : (
            <div id="noEventsMessage" className="text-center text-muted">
              <p>No events found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Events;

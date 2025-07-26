import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";

function EventDetail() {
  const { getData } = useAPI();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [event, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(`events/${id}`, setLoading, setError);
      setEvents(data);
    };
    fetchData();
  }, []);

  if (!event) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary mb-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted fw-semibold">Fetching data, please wait...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row px-3">
        <div className="col-8 px-3">
          <h1>{event.title}</h1>
          <p className="text-muted ps-2">
            Date:{" "}
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at {event.time}
          </p>
          {event.images?.length > 0 && (
            <div
              id="imagePreviewNewsCreateCarousel"
              className="carousel slide mt-3 w-100"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {event.images?.map((src, i) => (
                  <div
                    key={i}
                    className={`carousel-item ${i === 0 ? "active" : ""}`}
                  >
                    <img
                      src={
                        src.startsWith("http") || src.startsWith("blob:")
                          ? src
                          : `/storage/${src}`
                      }
                      alt={`Preview ${i + 1}`}
                      className="d-block w-100 img-fluid rounded-3"
                      style={{
                        height: "400px",
                        objectFit: "contain",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                ))}
              </div>

              {event.images?.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#imagePreviewNewsCreateCarousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                      style={{ filter: "invert(100%)" }}
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#imagePreviewNewsCreateCarousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                      style={{ filter: "invert(100%)" }}
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}
            </div>
          )}

          <div className="fs-3 mt-3 d-flex gap-2">
            <Link
              to={"https://www.facebook.com/profile.php?id=61553280974578"}
              className="bi bi-facebook"
              style={{ color: "#1877F2" }}
              aria-label="Share on Facebook"
            ></Link>
            <Link
              to={"https://www.instagram.com/"}
              className="bi bi-instagram"
              style={{ color: "#E4405F" }}
              aria-label="Share on Instagram"
            ></Link>
            <Link
              to={"https://x.com/"}
              className="bi bi-twitter"
              style={{ color: "#1DA1F2" }}
              aria-label="Share on Twitter"
            ></Link>
          </div>

          <p
            className="p-3 lead"
            style={{ textIndent: "50px", textAlign: "justify" }}
          >
            {event.description}
          </p>
          <Link to={"/"} className="btn btn-outline-dark">
            <i className="bi bi-arrow-left"></i> Go to Home Page
          </Link>
        </div>

        <div className="col-4 px-3">
          <div className="card shadow-lg mb-4">
            <div className="card-header text-center py-3">
              <h5 className="mb-1 fw-semibold text-uppercase">Event Details</h5>
              <p className="text-muted small m-0">
                Registration:{" "}
                {new Date(event.registration_start_date).toLocaleDateString()} -{" "}
                {new Date(event.registration_end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="card-body">
              <div className="px-2">
                <p>
                  <i className="bi bi-calendar-event"></i>{" "}
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <i className="bi bi-clock"></i> <strong>Time:</strong>{" "}
                  {event.time}
                </p>
                <p>
                  <i className="bi bi-geo-alt"></i> <strong>Location:</strong>{" "}
                  {event.location}
                </p>
                <p>
                  <i className="bi bi-person-workspace"></i>{" "}
                  <strong>Organizer:</strong> {event.event_organizer}
                </p>
                <p>
                  <i className="bi bi-telephone"></i> <strong>Contact:</strong>{" "}
                  {event.contact_number}
                </p>
              </div>

              {event.requirements && (
                <div className="mt-4">
                  <h6>
                    <i className="bi bi-list-check"></i>{" "}
                    <strong>Requirements:</strong>
                  </h6>
                  <ul className="list-unstyled px-2">
                    {event.requirements.split(",").map((req, index) => (
                      <li key={index} className="mb-1">
                        <i className="bi bi-check-lg text-success"></i>{" "}
                        {req.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}              

              <Link
                to={`/registration/${event.id}`}
                className="btn btn-primary w-100"
              >
                <i className="bi bi-pencil-square"></i> Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;

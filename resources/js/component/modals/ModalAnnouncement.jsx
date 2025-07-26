import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAPI } from "../contexts/ApiContext";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

function ModalAnnouncement() {
  const { getData } = useAPI();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await getData(
        "announcements?sort=published",
        (data) => {
          const sorted = [...data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setFilteredAnnouncements(sorted.slice(0, 4));
        },
        setLoading,
        setError
      );
    };
    fetchData();
  }, [getData]);

  const handleReadMore = (id) => {
    navigate(`/announcements/${id}`);
    const modal = Modal.getInstance(
      document.getElementById("announcement_modal")
    );
    if (modal) modal.hide();
  };

  return (
    <>
      <div
        className="modal fade"
        id="announcement_modal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="announcementModalLabel"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="announcementModalLabel">
                Announcements
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div
                  className="d-flex flex-column justify-content-center align-items-center"
                  style={{ minHeight: "200px" }}
                >
                  <div
                    className="spinner-border text-primary mb-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted fw-semibold">
                    Fetching data, please wait...
                  </p>
                </div>
              ) : (
                <div className="container mb-5">
                  <div className="row g-5">
                    {filteredAnnouncements.map((announcement) => (
                      <div className="col-12" key={announcement.id}>
                        <div className="card shadow">
                          <img
                            src={
                              announcement.images[0] &&
                              (announcement.images[0].startsWith("http") ||
                              announcement.images[0].startsWith("blob:")
                                ? announcement.images[0]
                                : `/storage/${announcement.images[0]}`)
                            }
                            className="card-img-top object-fit-fill"
                            alt={announcement.title}
                          />
                          <div className="card-body">
                            <p className="small">
                              {new Date(
                                announcement.date_published
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>

                            <h5 className="card-title">{announcement.title}</h5>
                            <p className="card-text">
                              {announcement.description}
                            </p>
                            <button
                              onClick={() => handleReadMore(announcement.id)}
                              className="btn btn-primary rounded-pill px-4 py-1 read-more-btn"
                            >
                              Read more
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success text-light"
                data-bs-dismiss="modal"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalAnnouncement;

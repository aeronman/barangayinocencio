import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";

function AnnouncementDetail() {
  const { getData } = useAPI();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [announcementList, setAnnouncementList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(
        "announcements?sort=published",
        setLoading,
        setError
      );
      setAnnouncementList(data);
    };
    fetchData();
  }, []);

  const announcement = announcementList.find((item) => item.id == id);

  if (!announcement) {
    return (
      // <div className="container text-center my-5">
      //   <h3 className="text-danger">Announcement not found</h3>
      //   <button
      //     onClick={() => window.history.back()}
      //     className="btn btn-outline-primary"
      //   >
      //     Go back to the previous page
      //   </button>
      // </div>
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
          <h1>{announcement.title}</h1>
          <p className="text-muted ps-2">
            Date:{" "}
            {new Date(announcement.date_published).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {announcement.images.length > 0 && (
            <div
              id="imagePreviewNewsCreateCarousel"
              className="carousel slide mt-3 w-100"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {announcement.images.map((src, i) => (
                  <div
                    key={i}
                    className={`carousel-item ${i === 0 ? "active" : ""}`}
                  >
                    <img
                      src={
                          src.startsWith("http") || src.startsWith("blob:")
                          ? src
                        : `${import.meta.env.VITE_APP_BASE_URL || ""}/storage/app/public/${src}`

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

              {announcement.images.length > 1 && (
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
            {announcement.description}
          </p>
          <Link to={"/"} className="btn btn-outline-dark">
            <i className="bi bi-arrow-left"></i> Go to Home Page
          </Link>
        </div>

        <div className="col-4 px-3">
          <h5 className="fw-bold">Latest Announcements</h5>

          {announcementList.slice(0, 4).map((announcement, index) => (
            <div className="card shadow-lg mb-4" key={announcement.id || index}>
              <div className="card-body">
                <p className="text-muted">
                  {new Date(announcement.date_published).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
                <h5 className="fw-semibold text-uppercase">
                  {announcement.title}
                </h5>
                <p>
                  {announcement.description?.slice(0, 120) ||
                    "No preview available..."}
                </p>
                <div className="text-end">
                  <Link
                    to={`/announcements/${announcement.id}`}
                    className="text-dark link-underline-primary link-offset-2 link-underline link-underline-opacity-50"
                  >
                    See More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementDetail;

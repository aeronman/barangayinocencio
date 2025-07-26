import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";

const NewsDetail = () => {
  const { getData } = useAPI();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData("news?sort=published", setLoading, setError);

      setNewsList(data);
    };
    fetchData();
  }, []);

  const news = newsList.find((item) => item.id == id);

  if (!news) {
    return (
      // <div className="container text-center my-5">
      //   <h3 className="text-danger">News not found</h3>
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
          <h1>{news.title}</h1>
          <p className="text-muted ps-2">
            Date:{" "}
            {new Date(news.date_published).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          
          {news.images.length > 0 && (
              <div
                id="imagePreviewNewsCreateCarousel"
                className="carousel slide mt-3 w-100"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {news.images.map((src, i) => (
                    <div
                      key={i}
                      className={`carousel-item ${i === 0 ? "active" : ""}`}
                    >
                      <img
                        src={
                          src.startsWith("http") || src.startsWith("blob:")
                            ? src
                            : `/storage/app/public/${src}`
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

                {news.images.length > 1 && (
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
            className="p-3 text-wrap"
            style={{ textIndent: "50px", textAlign: "justify" }}
          >
            {news.description}
          </p>
          <Link to={"/news"} className="btn btn-outline-dark">
            <i className="bi bi-arrow-left"></i> Go to News Page
          </Link>
        </div>

        <div className="col-4 px-3">
          <h5 className="fw-bold">Latest Post</h5>
          {newsList.slice(0, 4).map((news, index) => (
            <div className="card shadow-lg mb-4" key={news.id || index}>
              <div className="card-body">
                <p className="text-muted">
                  {new Date(news.date_published).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <h5 className="fw-semibold text-uppercase">{news.title}</h5>
                <p>
                  {news.description?.slice(0, 120) ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean blandit elit eu iaculis sodales..."}
                </p>
                <div className="text-end">
                  <Link
                    to={`/news/${news.id}`}
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
};

export default NewsDetail;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";
import Carousel from "../../component/Caroucel";

function News({ isFullPage = true }) {
  const { getData } = useAPI();
  const [newsList, setNewsList] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData("carousel?page=news", setCarouselItems, setLoading, setError);
  }, [getData]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const defaultFilter = `${year}-${month}`;
    setFilterDate(defaultFilter);

    const fetchData = async () => {
      await getData(
        "news?sort=published",
        (data) => {
          const sorted = [...data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setNewsList(sorted);

          if (isFullPage) {
            const filtered = sorted.filter(
              (n) => n.date_published === defaultFilter
            );
            setFilteredNews(filtered);
          } else {
            setFilteredNews(sorted.slice(0, 4));
          }
        },
        setLoading,
        setError
      );
    };

    fetchData();
  }, [getData, isFullPage]);

  useEffect(() => {
    const handleManualFilter = () => {
      const filtered = newsList.filter((n) => {
        const formattedDate = new Date(n.date_published)
          .toISOString()
          .slice(0, 7);
        return formattedDate === filterDate;
      });
      setFilteredNews(filtered);
    };

    if (isFullPage && newsList.length > 0 && filterDate) {
      handleManualFilter();
    }
  }, [newsList, filterDate, isFullPage]);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilterDate(selected);
  };

  if (loading) return null;
  if (error)
    return (
      <div className="text-danger text-center">Failed to load news data.</div>
    );

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
            <h5 className="section-title text-primary">News & Updates</h5>
            <h2 className="main-heading mt-3 text-dark">
              Stay Informed with the Latest <br /> News & Announcements
            </h2>
            <p className="sub-text mt-3">
              Get the latest updates on community events, upcoming projects, and
              important announcements. Stay connected with the latest news from
              the Sangguniang Kabataan (SK) of Barangay Inocencio.
            </p>
          </div>
        )}
        <div className="row g-4">
          {filteredNews.length > 0 ? (
            filteredNews.map((news, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div className="card rounded-3 shadow-lg border-0 h-100 d-flex flex-column">
                
                  <img
                    src={
                      news.images[0].startsWith("http") ||
                      news.images[0].startsWith("blob:")
                        ? news.images[0]
                        : `/storage/app/public/${news.images[0]}`
                    }
                    className="card-img-top rounded-top-3 object-fit-cover"
                    alt="News"
                    style={{ height: "160px" }}
                  />
                  <div className="card-body d-flex flex-column h-100 p-3">
                    <p className="news-date small text-uppercase">
                      {new Date(news.date_published).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <h5 className="card-title">{news.title}</h5>
                    <p className="card-text flex-grow-1">
                      {news.description.slice(0, 100)}...
                    </p>
                    <div className="mt-auto mb-3">
                      <Link
                        to={`/news/${news.id}`}
                        className="btn btn-primary rounded-pill px-4 py-1 read-more-btn"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">
              <p>No news found{isFullPage && " for this period"}.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default News;

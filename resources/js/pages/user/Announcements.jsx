// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAPI } from "../../component/contexts/ApiContext";

// function Announcements({ isFullPage = false }) {
//   const { getData } = useAPI();
//   const [announcementList, setAnnouncementList] = useState([]);
//   const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
//   const [filterDate, setFilterDate] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState();

//   useEffect(() => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const defaultFilter = `${year}-${month}`;
//     setFilterDate(defaultFilter);

//     const fetchData = async () => {
//       await getData(
//         "announcements?sort=published",
//         (data) => {
//           const sorted = [...data].sort(
//             (a, b) => new Date(b.date) - new Date(a.date)
//           );
//           setAnnouncementList(sorted);

//           if (isFullPage) {
//             const filtered = sorted.filter(
//               (a) => a.data_date === defaultFilter
//             );
//             setFilteredAnnouncements(filtered);
//           } else {
//             setFilteredAnnouncements(sorted.slice(0, 4));
//           }
//         },
//         setLoading,
//         setError
//       );
//     };

//     fetchData();
//   }, [getData, isFullPage]);

//   useEffect(() => {
//     const handleManualFilter = () => {
//       const filtered = announcementList.filter((n) => {
//         const formattedDate = new Date(n.date_published)
//           .toISOString()
//           .slice(0, 7);
//         return formattedDate === filterDate;
//       });
//       setFilteredAnnouncements(filtered);
//     };

//     if (isFullPage && announcementList.length > 0 && filterDate) {
//       handleManualFilter();
//     }
//   }, [announcementList, filterDate, isFullPage]);

//   const handleFilterChange = (e) => {
//     const selected = e.target.value;
//     setFilterDate(selected);
//   };

//   if (loading) return null;
//   if (error)
//     return (
//       <div className="text-danger text-center">
//         Failed to load announcements.
//       </div>
//     );

//   return (
//     <div className="container p-5">
//       {isFullPage ? (
//         <div className="input-group mb-4 mt-5" style={{ maxWidth: "300px" }}>
//           <input
//             type="month"
//             className="form-control"
//             value={filterDate}
//             onChange={handleFilterChange}
//           />
//         </div>
//       ) : (
//         <div className="container text-center my-5">
//           <h5 className="section-title text-primary">Announcements</h5>
//           <h2 className="main-heading mt-3 text-dark">
//             Important Updates & Notices
//           </h2>
//           <p className="sub-text mt-3">
//             Stay updated with the latest announcements, important reminders, and
//             community notices.
//           </p>
//         </div>
//       )}

//       <div className="row g-4">
//         {filteredAnnouncements.length > 0 ? (
//           filteredAnnouncements.map((announcement, index) => (
//             <div className="col-12 col-sm-6 col-lg-3" key={index}>
//               <div className="card rounded-3 shadow-lg border-0 h-100 d-flex flex-column">
//                 <img
//                   src={
//                     announcement.image[0].startsWith("http") ||
//                     announcement.image[0].startsWith("blob:")
//                       ? announcement.image[0]
//                       : `/storage/${announcement.image[0]}`
//                   }
//                   className="card-img-top rounded-top-3 object-fit-cover"
//                   alt="Announcement"
//                   style={{ height: "160px" }}
//                 />
//                 <div className="card-body d-flex flex-column h-100 p-3">
//                   <p className="announcement-date small text-uppercase">
//                     {new Date(announcement.date_published).toLocaleDateString(undefined, {
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </p>
//                   <h5 className="card-title">{announcement.title}</h5>
//                   <p className="card-text flex-grow-1">
//                     {announcement.description.slice(0, 100)}...
//                   </p>
//                   <div className="mt-auto mb-3">
//                     <Link
//                       to={`/announcements/${announcement.id}`}
//                       className="btn btn-primary rounded-pill px-4 py-1 read-more-btn"
//                     >
//                       Read more
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-muted">
//             <p>No announcements found{isFullPage && " for this period"}.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Announcements;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";
import Carousel from "../../component/Caroucel";

function Announcements({ isFullPage = true }) {
  const { getData } = useAPI();
  const [announcementsList, setNewsList] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [filteredAnnouncements, setFilteredNews] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData(
      "carousel?page=announcements",
      setCarouselItems,
      setLoading,
      setError
    );
  }, [getData]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const defaultFilter = `${year}-${month}`;
    setFilterDate(defaultFilter);

    const fetchData = async () => {
      await getData(
        "announcements?sort=published",
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
      const filtered = announcementsList.filter((n) => {
        const formattedDate = new Date(n.date_published)
          .toISOString()
          .slice(0, 7);
        return formattedDate === filterDate;
      });
      setFilteredNews(filtered);
    };

    if (isFullPage && announcementsList.length > 0 && filterDate) {
      handleManualFilter();
    }
  }, [announcementsList, filterDate, isFullPage]);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilterDate(selected);
  };

  if (loading) return null;
  if (error)
    return (
      <div className="text-danger text-center">
        Failed to load announcements data.
      </div>
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
            <h5 className="section-title text-primary">Announcements</h5>
            <h2 className="main-heading mt-3 text-dark">
              Important Updates & Notices
            </h2>
            <p className="sub-text mt-3">
              Stay updated with the latest announcements, important reminders,
              and community notices.
            </p>
          </div>
        )}
        <div className="row g-4">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcements, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div className="card rounded-3 shadow-lg border-0 h-100 d-flex flex-column">
                  <img
                    src={
                      announcements.images[0].startsWith("http") ||
                      announcements.images[0].startsWith("blob:")
                        ? announcements.images[0]
                        : `/storage/app/public/${announcements.images[0]}`
                    }
                    className="card-img-top rounded-top-3 object-fit-cover"
                    alt="Announcements"
                    style={{ height: "160px" }}
                  />
                  <div className="card-body d-flex flex-column h-100 p-3">
                    <p className="announcements-date small text-uppercase">
                      {new Date(
                        announcements.date_published
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h5 className="card-title">{announcements.title}</h5>
                    <p className="card-text flex-grow-1">
                      {announcements.description.slice(0, 100)}...
                    </p>
                    <div className="mt-auto mb-3">
                      <Link
                        to={`/announcements/${announcements.id}`}
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
              <p>No announcements found{isFullPage && " for this period"}.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Announcements;

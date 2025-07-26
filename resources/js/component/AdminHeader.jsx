import React, { useEffect, useState } from "react";
import { useAPI } from "./contexts/ApiContext";

const AdminHeader = () => {
  const { getData } = useAPI();
  const [websiteInformation, setWebsiteInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const settings = await getData(
        "settings",
        setWebsiteInformation,
        setLoading,
        setError
      );
    };

    fetchData();
  }, []);
  return (
    <nav className="navbar navbar-expand-lg shadow-sm mb-3">
      <div className="container-fluid d-flex align-items-center justify-content-between align-items-center px-4">
        <div className="input-group w-50">
          <input type="text" className="form-control rounded-start-pill" />
          <button
            className="btn btn-primary input-group-text rounded-end-pill"
            id="basic-addon1"
          >
            <div className="px-3">Search</div>
          </button>
        </div>

        <div className="d-flex justify-content-end align-items-center">
          {/* <div className="dropdown mx-4">
            <button
              type="button"
              className="btn position-relative border-0 bg-transparent p-2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-chat-fill fs-4 text-primary"></i>
              <small className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-2">
                99+
                <span className="visually-hidden">unread messages</span>
              </small>
            </button>

            <ul className="dropdown-menu dropdown-menu-end bg-light text-dark shadow-lg  rounded-3 border-0">
              <li className="dropdown-header text-center fw-bold py-3">
                Notifications
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-start" href="#">
                  <div className="me-3">
                    <i className="bi bi-box-seam text-primary fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-semibold">New Ticket Received</div>
                    <small className="text-muted">2 mins ago</small>
                  </div>
                </a>
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-start" href="#">
                  <div className="me-3">
                    <i className="bi bi-chat-dots text-secondary fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-semibold">Message from HR Department</div>
                    <small className="text-muted">10 mins ago</small>
                  </div>
                </a>
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-start" href="#">
                  <div className="me-3">
                    <i className="bi bi-exclamation-triangle text-warning fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-semibold">System Update Available</div>
                    <small className="text-muted">1 hour ago</small>
                  </div>
                </a>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a className="dropdown-item text-center fw-bold" href="#">
                  View All Notifications
                </a>
              </li>
            </ul>
          </div> */}

          {/* Logo Image */}

          <img
            alt="Logo"
            width="40"
            height="40"
            src={
              websiteInformation?.logo
                ? websiteInformation?.logo.startsWith("http") ||
                  websiteInformation?.logo.startsWith("blob:")
                  ? websiteInformation?.logo
                  : `/storage/${websiteInformation?.logo}`
                : "/images/Logo.png"
            }
            className="rounded-circle"
          />
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;

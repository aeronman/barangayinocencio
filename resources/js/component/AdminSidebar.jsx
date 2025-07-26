import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useAPI } from "./contexts/ApiContext";

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const { getData } = useAPI();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeEventMenu, setActiveEventMenu] = useState(false);
  const [activeServicesMenu, setActiveServicesMenu] = useState(false);
  const [services, setServices] = useState([]);

  const [websiteInformation, setWebsiteInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await getData("settings", setWebsiteInformation, setLoading, setError);
    };
    fetchData();
  }, []);

  const pages = [
    {
      page: "Dashboard",
      link: "/admin/dashboard",
      icon: "bi bi-graph-up-arrow",
    },
    {
      page: "Membership",
      link: "/admin/membership",
      icon: "bi bi-people-fill",
    },
    { page: "News & Updates", link: "/admin/news", icon: "bi bi-newspaper" },
    {
      page: "Announcement",
      link: "/admin/announcements",
      icon: "bi bi-megaphone-fill",
    },
    {
      page: "Manage Events",
      link: "/admin/events/manage",
      icon: "bi bi-calendar-check-fill",
    },
    {
      page: "Participants",
      link: "/admin/events/participants",
      icon: "bi bi-person-up",
    },
    {
      page: "Manage Services",
      link: "/admin/services/manage",
      icon: "bi bi-sliders",
    },
    {
      page: "Computer",
      link: "/admin/services/computer",
      icon: "bi bi-pc-display",
    },
    {
      page: "Printing",
      link: "/admin/services/printing",
      icon: "bi bi-printer",
    },
    {
      page: "Transparency",
      link: "/admin/transparency",
      icon: "bi bi-transparency",
    },
    { page: "Settings", link: "/admin/settings", icon: "bi bi-gear-fill" },
    { page: "Logout", link: "/admin/logout", icon: "bi bi-box-arrow-left" },
  ];
  

  const isEventPageActive = () => location.pathname.startsWith("/admin/events");
  const isServicesPageActive = () =>
    location.pathname.startsWith("/admin/services");

  useEffect(() => {
    setActiveEventMenu(isEventPageActive());
    setActiveServicesMenu(isServicesPageActive());
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("logout");
      localStorage.removeItem("auth_token");
      navigate("/login");
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    const serviceRequests = [
      { endpoint: "rrs", path: "/resource-reservation" },
      { endpoint: "frs", path: "/facilities-reservation" },
      { endpoint: "ers", path: "/event-registration" },
      { endpoint: "rls", path: "/resource-lending" },
      { endpoint: "vs", path: "/volunteer" },
    ];

    serviceRequests.forEach(({ endpoint, path }) => {
      getData(
        endpoint,
        (newData) => {
          const updatedServices = newData.map((service) => ({
            ...service,
            path: `${path}/${service.id}`,
          }));

          setServices((prevServices) => {
            const allServices = [...prevServices, ...updatedServices];
            const serviceMap = new Map();
            allServices.forEach((service) => {
              serviceMap.set(service.service_name, service); // remove duplicates
            });
            return Array.from(serviceMap.values());
          });
        },
        setLoading,
        setError
      );
    });
  }, [getData]);

  return (
    <div
      className={`d-flex flex-column vh-100 shadow-lg border text-bg-primary fixed-top transition-all`}
      style={{
        width: collapsed ? "80px" : "300px",
        transition: "width 0.3s ease",
        overflowX: "hidden",
      }}
      id="Adminsidebar"
    >
      <Link to="/admin/dashboard" className="text-decoration-none">
        <div className="d-flex justify-content-start p-3 text-light">
          <img
            src={
              websiteInformation?.logo
                ? websiteInformation.logo.startsWith("http") ||
                  websiteInformation.logo.startsWith("blob:")
                  ? websiteInformation.logo
                  : `/storage/${websiteInformation.logo}`
                : "/images/Logo.png"
            }
            alt="Logo"
            width="40"
            height="40"
            className="rounded-circle"
          />
          {!collapsed && (
            <div className="ms-2 d-flex flex-column justify-content-center">
              <div className="m-0 fw-bold" style={{ fontSize: "0.8rem" }}>
                {websiteInformation?.website_name}
              </div>
              <div className="m-0" style={{ fontSize: "0.6rem" }}>
                Brgy. Inocencio, Trece Martires
              </div>
            </div>
          )}
        </div>
      </Link>

      <button
        className="btn btn-sm btn-outline-light m-2"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <i
          className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}
        ></i>
      </button>

      <div className="nav nav-underline flex-column h-100">
        <div className="px-2 px-md-4 pb-4 w-100 h-100">
          <ul className="text-nowrap list-unstyled h-100 d-flex flex-column">
            {pages
              .filter(
                (page) =>
                  page.link.includes("/admin/dashboard") ||
                  page.link.includes("/admin/membership") ||
                  page.link.includes("/admin/news") ||
                  page.link.includes("/admin/announcements")
              )
              .map((page) => (
                <li className="nav-item text-start" key={page.link}>
                  <Link
                    to={page.link}
                    className={`nav-link text-light ${
                      location.pathname.startsWith(page.link)
                        ? "active fw-bold"
                        : ""
                    }`}
                  >
                    <i className={`${page.icon} me-3`}></i>
                    <span className={`${collapsed ? "d-none" : "d-inline"}`}>
                      {page.page}
                    </span>
                  </Link>
                </li>
              ))}

            <li className="nav-item">
              <button
                className="nav-link text-light d-flex align-items-center w-100"
                onClick={() => setActiveEventMenu((prev) => !prev)}
                aria-expanded={activeEventMenu}
              >
                <i className="bi bi-calendar-event-fill"></i>
                <span className={`${collapsed ? "d-none" : "d-inline ms-3"}`}>
                  Events
                </span>
                <i
                  className={`bi ${
                    activeEventMenu ? "bi-chevron-up" : "bi-chevron-down"
                  } ${collapsed ? "ms-3" : "ms-auto"}`}
                ></i>
              </button>
              <ul
                className={`collapse list-unstyled ms-2 ${
                  activeEventMenu ? "show" : ""
                }`}
                id="eventsMenu"
              >
                {pages
                  .filter((page) => page.link.includes("/admin/events"))
                  .map((page) => (
                    <li key={page.link}>
                      <Link
                        to={page.link}
                        className={`nav-link text-light ${
                          location.pathname.startsWith(page.link)
                            ? "active fw-bold"
                            : ""
                        }`}
                      >
                        <i className={`${page.icon}`}></i>
                        <span
                          className={`${
                            collapsed ? "d-none" : "d-inline ms-3"
                          }`}
                        >
                          {page.page}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            <li className="nav-item">
              <button
                className="nav-link text-light d-flex align-items-center w-100"
                onClick={() => setActiveServicesMenu((prev) => !prev)}
                aria-expanded={activeServicesMenu}
              >
                <i className="bi bi-tools"></i>
                <span className={`${collapsed ? "d-none" : "d-inline ms-3"}`}>
                  Services
                </span>
                <i
                  className={`bi ${
                    activeServicesMenu ? "bi-chevron-up" : "bi-chevron-down"
                  } ${collapsed ? "ms-3" : "ms-auto"}`}
                ></i>
              </button>
              <ul
                className={`collapse list-unstyled ms-2 ${
                  activeServicesMenu ? "show" : ""
                }`}
                id="servicesMenu"
              >
                {pages
                  .filter((page) => page.link.includes("/admin/services"))
                  .map((page) => (
                    <li key={page.link}>
                      <Link
                        to={page.link}
                        className={`nav-link text-light ${
                          location.pathname.startsWith(page.link)
                            ? "active fw-bold"
                            : ""
                        }`}
                      >
                        <i className={`${page.icon}`}></i>
                        <span
                          className={`${
                            collapsed ? "d-none" : "d-inline ms-3"
                          }`}
                        >
                          {page.page}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            {pages
              .filter(
                (page) =>
                  page.link.includes("/admin/transparency") ||
                  page.link.includes("/admin/settings")
              )
              .map((page) => (
                <li className="nav-item text-start" key={page.link}>
                  <Link
                    to={page.link}
                    className={`nav-link text-light ${
                      location.pathname.startsWith(page.link)
                        ? "active fw-bold"
                        : ""
                    }`}
                  >
                    <i className={`${page.icon} me-3`}></i>
                    <span className={`${collapsed ? "d-none" : "d-inline"}`}>
                      {page.page}
                    </span>
                  </Link>
                </li>
              ))}

            <li className="nav-item mt-auto">
              <button
                type="submit"
                className="nav-link text-light border-0 bg-transparent w-100 text-start"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-left me-3"></i>
                <span className={`${collapsed ? "d-none" : "d-inline"}`}>
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

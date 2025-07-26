import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAPI } from "./contexts/ApiContext";

const generateNavItems = (services) => ({
  Home: "/",
  Membership: "/membership",
  "News & Updates": "/news",
  Events: "/events",
  Services: {
    base: "/services",
    items: {
      "Computer Services": "/services/computer", // Fixed item for ID 1
      "Printing Services": "/services/printing", // Fixed item for ID 2
      ...services
        .filter((service) => service.id !== 1 && service.id !== 2) // Exclude ID 1 and 2
        .reduce((acc, service) => {
          const slug = service.service_name.replace(/\s+/g, "-").toLowerCase();
          acc[service.service_name] = `/services/${slug}`;
          return acc;
        }, {}),
    },
  },
  "About Us": "/about",
  FAQs: "/faqs",
  Transparency: "/transparency",
});

function Header() {
  const { getData } = useAPI();
  const location = useLocation();
  const currentPath = location.pathname;
  const [services, setServices] = useState([]);

  const [websiteInformation, setWebsiteInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await getData("settings", setWebsiteInformation, setLoading, setError);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  if (loading) return null;

  return (
    <>
      <nav className="navbar bg-primary">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={
                websiteInformation?.logo
                  ? websiteInformation?.logo.startsWith("http") ||
                    websiteInformation?.logo.startsWith("blob:")
                    ? websiteInformation?.logo
                    : `/storage/${websiteInformation?.logo}`
                  : "/images/Logo.png"
              }
              alt="Logo"
              width="100"
              height="100"
              className="object-fit-contain rounded-circle"
            />
            <div className="text-light ms-3">
              <h1 className="m-0 fw-bold">
                {websiteInformation?.website_name || "Batang Inocencio"}
              </h1>
              <h5 className="m-0">Brgy. Inocencio, Trece Martires</h5>
            </div>
          </NavLink>
          <form className="d-flex" role="search">
            <div className="input-group">
              <span className="input-group-text rounded-start-pill">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control rounded-end-pill"
                placeholder="Search"
              />
            </div>
          </form>
        </div>
      </nav>

      <nav className="navbar nav-underline navbar-expand-lg bg-body-tertiary shadow-lg sticky-top">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav w-100 nav-fill" ref={dropdownRef}>
              {Object.entries(generateNavItems(services)).map(
                ([name, link]) => {
                  if (typeof link === "string") {
                    const isActive =
                      link === "/"
                        ? currentPath === link
                        : currentPath.startsWith(link);
                    return (
                      <li className="nav-item" key={name}>
                        <NavLink
                          to={link}
                          className={({ isActive: isNavLinkActive }) =>
                            `nav-link ${
                              isActive || isNavLinkActive ? "active" : ""
                            }`
                          }
                        >
                          {name}
                        </NavLink>
                      </li>
                    );
                  } else if (typeof link === "object" && link.items) {
                    const isParentActive = currentPath.startsWith(link.base);
                    const isOpen = openDropdown === name;

                    return (
                      <li
                        className={`nav-item dropdown ${isOpen ? "show" : ""}`}
                        key={name}
                      >
                        <span
                          className={`nav-link dropdown-toggle ${
                            isParentActive ? "active" : ""
                          }`}
                          role="button"
                          onClick={() =>
                            setOpenDropdown(openDropdown === name ? null : name)
                          }
                        >
                          {name}
                        </span>
                        <ul
                          className={`dropdown-menu dropdown-menu-end p-3 border-0 shadow-lg ${
                            isOpen ? "show" : ""
                          }`}
                          aria-labelledby={name}
                        >
                          <div className="row g-2">
                            {Object.entries(link.items).map(
                              ([subName, subLink]) => (
                                <div className="col-12" key={subName}>
                                  <NavLink
                                    className="dropdown-item px-3 py-2 rounded d-flex align-items-center"
                                    to={subLink}
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <span>{subName}</span>
                                  </NavLink>
                                </div>
                              )
                            )}
                          </div>
                        </ul>
                      </li>
                    );
                  }
                  return null;
                }
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;

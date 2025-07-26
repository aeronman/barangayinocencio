import React, { useEffect, useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { Link } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";
import ServicesTable from "../../component/tables/ServicesTable";

function ServicesManagement() {
  const { getData } = useAPI();
  const [showServices, setShowServices] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const servicesType = [
    {
      name: "Resource Reservation System",
      path: "/admin/services/resource-reservation",
    },
    {
      name: "Facility Reservation System",
      path: "/admin/services/facility-reservation",
    },
    {
      name: "Event Registration System",
      path: "/admin/services/event-registration",
    },
    {
      name: "Resource Lending Management System",
      path: "/admin/services/resource-lending",
    },
    {
      name: "Volunteer Management System",
      path: "/admin/services/volunteer-management",
    },
  ];

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
              serviceMap.set(service.service_name, service);
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
    <>
      <Breadcrumb />

      <div className="my-5 text-center border rounded-4 shadow-lg d-flex justify-content-center align-items-center p-4">
        {loading ? (
          <p>Loading Services</p>
        ) : (
          <>
            {error && <p className="text-danger">Failed to load services.</p>}

            {!showServices && services.length > 0 && (
              <>
                <Link to="/admin/services/computer">
                  <button className="btn btn-primary btn-lg px-5 py-1 mx-2">
                    Computer Rental
                  </button>
                </Link>
                <Link to="/admin/services/printing">
                  <button className="btn btn-primary btn-lg px-5 py-1 mx-2">
                    Printing Service
                  </button>
                </Link>
                {services.map((service, index) => {
                  const name = service.service_name.toLowerCase();
                  if (
                    name === "printing services" ||
                    name === "computer rental"
                  )
                    return null;

                  return (
                    <Link
                      key={index}
                      to={`/admin/services/${name.replace(/\s+/g, "-")}`}
                    >
                      <button className="btn btn-primary btn-lg px-5 py-1 mx-2">
                        {service.service_name}
                      </button>
                    </Link>
                  );
                })}
              </>
            )}

            {showServices && (
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {servicesType.map((serviceType, index) => (
                  <Link key={index} to={serviceType.path}>
                    <button className="btn btn-secondary text-nowrap shadow-sm fs-4">
                      {serviceType.name}
                    </button>
                  </Link>
                ))}
              </div>
            )}

            <button
              className="btn btn-outline-primary btn-lg px-5 py-1 mx-2"
              onClick={() => setShowServices(!showServices)}
            >
              {showServices ? "Back" : "Add Service"}
            </button>
          </>
        )}
      </div>

      {!showServices && (
        <ServicesTable servicesData={services} hasActions={true} />
      )}
    </>
  );
}

export default ServicesManagement;

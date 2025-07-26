import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";
import ModalPreview from "../modals/ModalPreview";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

function ServicesTable({ servicesData, status='', hasActions }) {
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState(null);

  const filteredServicesData = status
    ? servicesData.filter((servicesItem) => servicesItem.availability_status === status)
    : servicesData;

  
  const actions = (id) => [
    {
      label: "View",
      onClick: () => {
        const servicesItem = servicesData.find((item) => item.id === id);
        setSelectedServices(servicesItem);
        const modal = new Modal(document.getElementById("previewModal"));
        modal.show();
      },
      className: "btn btn-sm text-light btn-info text-nowrap",
      icon: "bi bi-eye",
    }
  ];

  const servicesColumns = [
    {
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Service Name",
      accessorKey: "service_name",
    },
    {
      header: "Service System",
      accessorKey: "service_system",
    },
    {
      header: "Availability Status",
      accessorKey: "availability_status",
      cell: ({ row }) => {
        const status = row.original.availability_status;        
        if (status === "Available") {
          return <span className="badge bg-success">{status}</span>;
        } else {
          return <span className="badge bg-warning">{status}</span>;
        }
      },
    },
    {
      header: "Reservation Type",
      accessorKey: "reservation_type",
    },
  ];

  const formattedDate =
    selectedServices?.updated_at &&
    new Date(selectedServices.updated_at).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <ModalPreview
        header="Preview Services"
        id="previewModal"
        title={selectedServices?.title}
        description={selectedServices?.description}
        imagePreviews={selectedServices?.images}
        currentDate={formattedDate}
      />

      <TableComponent
        title="Services"
        columns={servicesColumns}
        data={filteredServicesData}
        loading={loading}
        actions={hasActions ? actions : null}
      />
    </>
  );
}

export default ServicesTable;

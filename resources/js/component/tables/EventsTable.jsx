import React, { useEffect, useState } from "react";
import { useAPI } from "../contexts/ApiContext";
import TableComponent from "./TableComponent";
import ModalPreview from "../modals/ModalPreview";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

function EventsTable({ status, hasActions }) {
  const { getData, postData, putData, deleteData } = useAPI();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [formattedDate, setFormattedDate] = useState(""); 

  useEffect(() => {
    getData("events", setEventsData, setLoading, setError);
  }, [getData]);

  const filteredEventsData = status
    ? eventsData.filter((event) => event.status === status)
    : eventsData;

  const actions = (eventId) => [
    {
      label: "View",
      onClick: () => {
        const eventItem = eventsData.find((item) => item.id === eventId); 
        setSelectedEvent(eventItem);
        const modal = new Modal(document.getElementById("previewModal"));
        modal.show();
      },
      className: "btn btn-sm text-light btn-info text-nowrap",
      icon: "bi bi-eye",
    },
    {
      label: "Edit",
      href: `/admin/events/edit/${eventId}`,
      className: "btn btn-sm text-light btn-warning text-nowrap",
      icon: "bi bi-pencil-square",
    },
  ];

  const eventsColumns = [
    {
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Last Modified",
      accessorKey: "updated_at",
      cell: ({ getValue }) => {
        const rawDate = getValue();
        const date = new Date(rawDate);
        return date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      },
    }
    ,
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        if (status === "published") {
          return <span className="badge bg-success">Published</span>;
        } else if (status === "draft") {
          return <span className="badge bg-warning">Draft</span>;
        }
        return null;
      },
    },
  ];

  return (
    <>
      <ModalPreview
        header="Preview Event"
        id="previewModal"
        title={selectedEvent?.title}
        description={selectedEvent?.description}
        imagePreviews={selectedEvent?.images}
        currentDate={formattedDate} 
      />
      <TableComponent
        title={"Events"}
        columns={eventsColumns}
        data={filteredEventsData}
        loading={loading}
        actions={hasActions ? actions : null}
      />
    </>
  );
}

export default EventsTable;

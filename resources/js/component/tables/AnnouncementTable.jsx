import React, { useEffect, useState } from "react";
import { useAPI } from "../contexts/ApiContext";
import TableComponent from "./TableComponent";
import ModalPreview from "../modals/ModalPreview";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

function AnnouncementsTable({ status, hasActions }) {
  const { getData } = useAPI();
  const [announcementsData, setAnnouncementsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState(null);

  useEffect(() => {
    getData("announcements", setAnnouncementsData, setLoading, setError);
  }, [getData]);

  const filteredAnnouncementsData = status
    ? announcementsData.filter((announcementsItem) => announcementsItem.status === status)
    : announcementsData;

  const actions = (id) => [
    {
      label: "View",
      onClick: () => {
        const announcementsItem = announcementsData.find((item) => item.id === id);
        setSelectedAnnouncements(announcementsItem);
        const modal = new Modal(document.getElementById("previewModal"));
        modal.show();
      },
      className: "btn btn-sm text-light btn-info text-nowrap",
      icon: "bi bi-eye",
    },
    {
      label: "Edit",
      href: `/admin/announcements/edit/${id}`,
      className: "btn btn-sm text-light btn-warning text-nowrap",
      icon: "bi bi-pencil-square",
    },
  ];

  const announcementsColumn = [
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
    },
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

  const formattedDate =
    selectedAnnouncements?.updated_at &&
    new Date(selectedAnnouncements.updated_at).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <ModalPreview
        header="Preview News"
        id="previewModal"
        title={selectedAnnouncements?.title}
        description={selectedAnnouncements?.description}
        imagePreviews={selectedAnnouncements?.images}
        currentDate={formattedDate}
      />

      <TableComponent
        title="News & Updates"
        columns={announcementsColumn}
        data={filteredAnnouncementsData}
        loading={loading}
        actions={hasActions ? actions : null}
      />
    </>
  );
}

export default AnnouncementsTable;

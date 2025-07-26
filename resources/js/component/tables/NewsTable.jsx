import React, { useEffect, useState } from "react";
import { useAPI } from "../contexts/ApiContext";
import TableComponent from "./TableComponent";
import ModalPreview from "../modals/ModalPreview";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";

function NewsTable({ status, hasActions }) {
  const { getData } = useAPI();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    getData("news", setNewsData, setLoading, setError);
  }, [getData]);

  const filteredNewsData = status
    ? newsData.filter((newsItem) => newsItem.status === status)
    : newsData;

  const actions = (id) => [
    {
      label: "View",
      onClick: () => {
        const newsItem = newsData.find((item) => item.id === id);
        setSelectedNews(newsItem);
        const modal = new Modal(document.getElementById("previewModal"));
        modal.show();
      },
      className: "btn btn-sm text-light btn-info text-nowrap",
      icon: "bi bi-eye",
    },
    {
      label: "Edit",
      href: `/admin/news/edit/${id}`,
      className: "btn btn-sm text-light btn-warning text-nowrap",
      icon: "bi bi-pencil-square",
    },
  ];

  const newsColumns = [
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
    selectedNews?.updated_at &&
    new Date(selectedNews.updated_at).toLocaleDateString("en-US", {
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
        title={selectedNews?.title}
        description={selectedNews?.description}
        imagePreviews={selectedNews?.images}
        currentDate={formattedDate}
      />

      <TableComponent
        title="News & Updates"
        columns={newsColumns}
        data={filteredNewsData}
        loading={loading}
        actions={hasActions ? actions : null}
      />
    </>
  );
}

export default NewsTable;

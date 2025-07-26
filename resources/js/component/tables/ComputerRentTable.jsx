import React, { useEffect, useState } from "react";
import { useAPI } from "../contexts/ApiContext";
import TableComponent from "./TableComponent";

function ComputerRentTable({ title, status, hasActions }) {
  const { getData, postData, putData, deleteData } = useAPI();
  const [announcementsData, setAnnouncementsData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const filteredAnnouncementsData = status
    ? announcementsData.filter(
        (announcementsItem) => announcementsItem.status === status
      )
    : announcementsData;

  const actions = [
    {
      label: "View",
      href: "/member/show",
      className: "btn btn-sm text-light btn-info text-nowrap",
      icon: "bi bi-eye",
    },
    {
      label: "Edit",
      href: "/member/edit",
      className: "btn btn-sm text-light btn-warning text-nowrap",
      icon: "bi bi-pencil-square",
    },
  ];

  const announcementsColumns = [
    {
      header: "Time",
      accessorKey: "time",
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
    {
      header: "Name",
      accessorKey: "name",
    },
  ];

  return (
    <>
      <TableComponent
        title={title}
        columns={announcementsColumns}
        data={filteredAnnouncementsData} 
        loading={loading}
        actions={hasActions && actions}
      />
    </>
  );
}

export default ComputerRentTable;

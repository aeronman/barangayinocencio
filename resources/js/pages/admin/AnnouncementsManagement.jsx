import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../component/ui/Breadcrumb";
import AnnouncementsTable from "../../component/tables/AnnouncementTable";

const AnnouncementsManagement = () => {
  const [announcementList, setAnnouncementList] = useState([]);
  const [filteredAnnouncementList, setFilteredAnnouncementList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("2024-08");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const announcements = [
        {
          id: 1,
          title: "Announcement 1",
          updated_at: "2024-08-01",
          status: "published",
        },
        {
          id: 2,
          title: "Announcement 2",
          updated_at: "2024-08-10",
          status: "draft",
        },
        {
          id: 3,
          title: "Announcement 3",
          updated_at: "2024-07-01",
          status: "published",
        },
      ];

      setAnnouncementList(announcements);
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const filtered = announcementList.filter((announcement) => {
      const announcementDate = new Date(announcement.updated_at);
      const [year, month] = selectedMonth.split("-");
      return (
        announcementDate.getFullYear() === parseInt(year) &&
        announcementDate.getMonth() + 1 === parseInt(month)
      );
    });
    setFilteredAnnouncementList(filtered);
  }, [announcementList, selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold">Announcements Management</h4>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Link
          to="/admin/announcements/create"
          className="btn btn-success text-light btn-lg d-flex align-items-center fw-bold"
        >
          <i className="bi bi-plus-circle me-2"></i> ADD NEW
        </Link>
        <Link
          to="/admin/announcements/drafts"
          className="btn btn-warning btn-lg d-flex align-items-center fw-bold text-white"
        >
          <i className="bi bi-file-earmark-text me-2"></i> DRAFT
        </Link>
      </div>

      <AnnouncementsTable hasActions={true} />
    </>
  );
};

export default AnnouncementsManagement;

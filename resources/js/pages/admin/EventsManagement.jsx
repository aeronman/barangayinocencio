import React from "react";
import AdminEventCalendar from "../../component/EventCalendar";
import Breadcrumb from "../../component/ui/Breadcrumb";
import EventTable from "../../component/tables/EventsTable";
import { Link } from "react-router-dom";

const EventsManagement = () => {

  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold">Events Management</h4>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Link
          to="/admin/events/create"
          className="btn btn-success text-light btn-lg d-flex align-items-center fw-bold"
        >
          <i className="bi bi-plus-circle me-2"></i> ADD NEW
        </Link>
        <Link
          to="/admin/events/drafts"
          className="btn btn-warning btn-lg d-flex align-items-center fw-bold text-white"
        >
          <i className="bi bi-file-earmark-text me-2"></i> DRAFT
        </Link>
      </div>

      <AdminEventCalendar />
      <EventTable hasActions={true} />
    </>
  );
};

export default EventsManagement;

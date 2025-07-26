import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../component/ui/Breadcrumb";
import EventsTable from "../../component/tables/EventsTable";

function EventsDrafts() {
  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold">Events - Drafts</h4>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Link
          to="/admin/events/create"
          className="btn btn-success text-light btn-lg d-flex align-items-center fw-bold"
        >
          <i className="bi bi-plus-circle me-2"></i> ADD NEW
        </Link>
      </div>

      <EventsTable status={'draft'} hasActions={true}/>
    </>
  );
}

export default EventsDrafts;

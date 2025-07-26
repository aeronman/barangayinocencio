import React, { useState, useEffect } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import AdminDashboardWidget from "../../component/AdminDashboardWidget";
import NewsTable from "../../component/tables/NewsTable";
import EventsTable from "../../component/tables/EventsTable";
import AnnouncementsTable from "../../component/tables/AnnouncementTable";
import Calendar from "../../component/Calendar";

function Dashboard() {
  return (
    <>
      <Breadcrumb />

      <h1 className="mb-4">👋 Hello, Admin!</h1>

      <div
        className="alert alert-success alert-dismissible fade show"
        role="alert"
      >
        <i className="bi bi-megaphone-fill fs-5"></i>
        <span className="ms-3 fs-5">Welcome to your admin dashboard!</span>
        <button type="button" className="btn-close" aria-label="Close"></button>
      </div>

      <AdminDashboardWidget />
      <Calendar />

      <EventsTable hasActions={false}/>
      <NewsTable hasActions={false}/>
      <AnnouncementsTable />
    </>
  );
}

export default Dashboard;

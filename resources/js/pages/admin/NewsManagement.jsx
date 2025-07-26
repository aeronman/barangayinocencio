import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../component/ui/Breadcrumb";
import NewsTable from "../../component/tables/NewsTable";

function NewsManagement() {
  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold">News & Updates Management</h4>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Link
          to="/admin/news/create"
          className="btn btn-success text-light btn-lg d-flex align-items-center fw-bold"
        >
          <i className="bi bi-plus-circle me-2"></i> ADD NEW
        </Link>
        <Link
          to="/admin/news/drafts"
          className="btn btn-warning btn-lg d-flex align-items-center fw-bold text-white"
        >
          <i className="bi bi-file-earmark-text me-2"></i> DRAFT
        </Link>
      </div>

      <NewsTable hasActions={true}/>
    </>
  );
}

export default NewsManagement;

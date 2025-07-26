import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../component/ui/Breadcrumb";
import NewsTable from "../../component/tables/NewsTable";

function NewsDrafts() {
  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold">News & Updates Management - Drafts</h4>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Link
          to="/admin/news/create"
          className="btn btn-success text-light btn-lg d-flex align-items-center fw-bold"
        >
          <i className="bi bi-plus-circle me-2"></i> ADD NEW
        </Link>
      </div>

      <NewsTable status={'draft'} hasActions={true}/>
    </>
  );
}

export default NewsDrafts;

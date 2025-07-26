import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../../component/ui/Breadcrumb";
import UploadModal from "./UploadModal";
import TransparencyCard from "./TransparencyCard";

const TransparencyManagement = () => {
  const [transparencies, setTransparencies] = useState([]);
  const [uploadCategory, setUploadCategory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchTransparencies = async () => {
    try {
      const response = await axios.get("/api/transparency");
      setTransparencies(response.data);
    } catch (error) {
      console.error("Error fetching transparencies:", error);
    }
  };

  useEffect(() => {
    fetchTransparencies();
  }, []);

  const groupedByCategory = transparencies.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold">Transparency Management</h4>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <i className="bi bi-upload me-2"></i>Upload Transparency File
        </button>
      </div>

      {Object.entries(groupedByCategory).map(([category, items]) => (
        <TransparencyCard
          key={category}
          title={category}
          items={items}
          onUpload={() => {
            setUploadCategory(category);
            setShowUploadModal(true);
          }}
        />
      ))}

      <UploadModal
        show={showUploadModal}
        category={uploadCategory}
        onHide={() => setShowUploadModal(false)}
        onUploadSuccess={fetchTransparencies}
      />
    </>
  );
};

export default TransparencyManagement;

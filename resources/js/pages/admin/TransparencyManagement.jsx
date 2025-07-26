import React, { useEffect, useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { useAPI } from "../../component/contexts/ApiContext";
import TableComponent from "../../component/tables/TableComponent";

const TransparencyManagement = () => {
  const { getData, postData, deleteData } = useAPI();
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [transparencies, setTransparencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTransparencyId, setSelectedTransparencyId] = useState(null);

  useEffect(() => {
    getData("transparencies", setTransparencies, setLoading, setError);
  }, [getData]);

  const handleUploadPDF = (transparencyId) => {
    const fileInput = document.getElementById(`file-input-${transparencyId}`);
    if (!fileInput) return alert("File input not found.");
    fileInput.click();
  };

  const handleFileChange = async (event, transparencyId) => {
    const file = event.target.files[0];
    if (!file) return alert("Please select a PDF file to upload.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await postData(
        `/transparencies/${transparencyId}/upload`,
        formData,
        null,
        setLoading,
        setError
      );

      if (response) {
        setTransparencies((prev) =>
          prev.map((t) =>
            t.id === transparencyId
              ? { ...t, files: [...t.files, response] }
              : t
          )
        );
        alert("File uploaded successfully.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Error uploading file.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Please enter a transparency category name.");
      return;
    }

    try {
      const newCategory = await postData(
        "/transparencies",
        { category: newCategoryName },
        null,
        setLoading,
        setError
      );

      if (newCategory) {
        await getData(
          "transparencies",
          setTransparencies,
          setLoading,
          setError
        );
        setShowModal(false);
        setNewCategoryName("");
      }
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Error adding category.");
    }
  };

  const columns = [
    {
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "File Name",
      accessorKey: "file_name",
      cell: ({ getValue }) => (
        <div className="text-center d-flex ms-3">{getValue()}</div>
      ),
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
      header: "Link",
      accessorKey: "file_url",
      cell: ({ getValue }) => {
        const url = getValue();
        return (
          <a
            href={`/storage/${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Open File
          </a>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const file = row.original;
        return (
          <button
            className="btn btn-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#confirmRemove"
            onClick={() => {
              setSelectedFile(file.file_url);
              setSelectedTransparencyId(file.id);
            }}
          >
            Remove
          </button>
        );
      },
    },
  ];

  const handleRemove = async () => {
    if (!selectedFile || !selectedTransparencyId) return;
    try {
      const response = await deleteData(
        `/transparencies/${selectedTransparencyId}`,
        setLoading,
        setError
      );

      if (response)
        getData("transparencies", setTransparencies, setLoading, setError);
    } catch (err) {
      console.error("Error removing file:", err);
      alert("Failed to remove file.");
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="mb-4">
        <h4 className="fw-bold text-primary">Transparency Management</h4>
      </div>

      <div className="d-flex gap-3 mb-4">
        <button
          className="btn btn-primary text-light btn-lg d-flex align-items-center fw-bold shadow"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i> ADD NEW CATEGORY
        </button>
      </div>

      {loading ? (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-semibold">
            Fetching data, please wait...
          </p>
        </div>
      ) : (
        transparencies.map((transparency) => (
          <div key={transparency.id} className="mb-4">
            <TableComponent
              topComponent={
                <>
                  <button
                    className="btn btn-outline-primary px-4 mb-2"
                    onClick={() => handleUploadPDF(transparency.id)}
                  >
                    Upload PDF
                  </button>
                  <input
                    type="file"
                    id={`file-input-${transparency.id}`}
                    className="d-none"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, transparency.id)}
                  />
                </>
              }
              title={transparency.category}
              data={transparency.files}
              columns={columns}
            />
          </div>
        ))
      )}

      <div
        className="modal fade"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        id="confirmRemove"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Changes</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove this file?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRemove}
                disabled={loading}
                data-bs-dismiss="modal"
              >
                {loading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddCategoryModal
        showModal={showModal}
        setShowModal={setShowModal}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleAddCategory={handleAddCategory}
      />
    </>
  );
};

const AddCategoryModal = ({
  showModal,
  setShowModal,
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
}) => (
  <div
    className={`modal fade ${showModal ? "show" : ""}`}
    style={{ display: showModal ? "block" : "none" }}
    tabIndex="-1"
    aria-labelledby="exampleModalLabel"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title text-primary" id="exampleModalLabel">
            Add New Category
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="transparencyName" className="text-primary">
              Category Name
            </label>
            <input
              type="text"
              id="transparencyName"
              className="form-control"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddCategory}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default TransparencyManagement;

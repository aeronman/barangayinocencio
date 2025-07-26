import React, { useEffect, useState } from "react";
import { useAPI } from "../contexts/ApiContext";
import TableComponent from "./TableComponent";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { saveAs } from "file-saver";

function PrintingScheduleTable({ title, status, hasActions }) {
  const { getData, deleteData, putData } = useAPI();
  const [printingScheduleData, setPrintingScheduleData] = useState([]);
  const [selectedPrintingSchedule, setSelectedPrintingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  const fetchData = () => {
    getData("printing-services", (data) => {
      const sorted = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPrintingScheduleData(sorted);
    }, setLoading, setError);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = status
    ? printingScheduleData.filter((item) => item.status === status)
    : printingScheduleData;

  const openModal = (id) => {
    const selected = printingScheduleData.find((item) => item.id === id);
    setSelectedPrintingSchedule(selected);
    const modal = new Modal(document.getElementById("previewModal"));
    modal.show();
  };

  const openConfirmationModal = (action) => {
    setModalAction(action);
    const modal = new Modal(document.getElementById("cancelConfirmationModal"));
    modal.show();
  };

  const formatDate = (raw) => {
    if (!raw) return "-";
    const date = new Date(raw);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCancelReservation = async () => {
    if (!selectedPrintingSchedule) return;

    try {
      await putData(`printing-services/${selectedPrintingSchedule.id}/cancel`);
      fetchData(); // Refresh data
      Modal.getInstance(document.getElementById("previewModal")).hide();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  };

  const handleMarkAsDone = async () => {
    if (!selectedPrintingSchedule) return;

    try {
      await putData(`printing-services/${selectedPrintingSchedule.id}/mark-as-done`);
      fetchData(); // Refresh data
      Modal.getInstance(document.getElementById("previewModal")).hide();
    } catch (error) {
      console.error("Failed to mark reservation as done:", error);
    }
  };

  const downloadFile = () => {
    if (!selectedPrintingSchedule?.uploaded_file) return;

    const fileUrl = selectedPrintingSchedule.uploaded_file.startsWith("http")
      ? selectedPrintingSchedule.uploaded_file
      : `/storage/app/public/printing_files/${selectedPrintingSchedule.uploaded_file}`;

    saveAs(fileUrl, "UploadedFile");
    console.log(fileUrl);
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "reservation_code" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusLabel =
          status === "completed"
            ? "Completed"
            : status === "cancelled"
            ? "Cancelled"
            : "Pending";

        const bgClass =
          status === "completed"
            ? "bg-success"
            : status === "cancelled"
            ? "bg-secondary"
            : "bg-warning";

        return <span className={`badge ${bgClass}`}>{statusLabel}</span>;
      },
    },
  ];

  const actions = (id) => [
    {
      label: "View",
      onClick: () => openModal(id),
      className: "btn btn-sm text-light btn-info",
      icon: "bi bi-eye",
    },
  ];

  return (
    <>
      <TableComponent
        title={title}
        columns={columns}
        data={filteredData}
        loading={loading}
        actions={hasActions && actions}
      />

      {/* Preview Modal */}
      <div className="modal fade" id="previewModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title">
                <i className="bi bi-printer me-2"></i>
                <strong>{selectedPrintingSchedule?.name || "Printing"}</strong>{" "}
                | {formatDate(selectedPrintingSchedule?.reservation_date)}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {selectedPrintingSchedule ? (
                <div className="d-flex justify-content-between">
                  <div className="col-8 p-3">
                    <div className="border rounded-4 shadow p-4">
                      <p><strong>Name:</strong> {selectedPrintingSchedule.name}</p>
                      <p><strong>Reservation Code:</strong> {selectedPrintingSchedule.reservation_code}</p>
                      <p><strong>Paper Size:</strong> {selectedPrintingSchedule.paper_size}</p>
                      <p><strong>Print Type:</strong> {selectedPrintingSchedule.print_type}</p>
                      <p><strong>Reservation For:</strong> {formatDate(selectedPrintingSchedule.reservation_date)}</p>
                      <p><strong>Uploaded File:</strong></p>
                      {selectedPrintingSchedule.uploaded_file ? (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={downloadFile}
                        >
                          <i className="bi bi-download me-1"></i> Download File
                        </button>
                      ) : (
                        <p className="text-muted fst-italic">No file uploaded</p>
                      )}
                    </div>
                  </div>
                  <div className="col-4 p-3">
                    <div className="text-center border rounded-4 shadow p-4">
                      <p className="fw-bold">Status</p>
                      <div
                        className={`p-2 mb-3 text-white rounded ${
                          selectedPrintingSchedule.status === "completed"
                            ? "bg-success"
                            : selectedPrintingSchedule.status === "cancelled"
                            ? "bg-secondary"
                            : "bg-warning"
                        }`}
                      >
                        {selectedPrintingSchedule.status}
                      </div>

                      {selectedPrintingSchedule.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success text-light btn-sm mb-2"
                            onClick={() => openConfirmationModal("done")}
                          >
                            Mark as Done
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openConfirmationModal("cancel")}
                          >
                            Cancel Reservation
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted">No data available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className="modal fade" id="cancelConfirmationModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header rounded-top-4">
              <h5 className="modal-title">Confirm Action</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body text-center">
              <p>
                Are you sure you want to{" "}
                {modalAction === "cancel" ? "cancel" : "mark as done"} this
                reservation?
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                className={`btn ${
                  modalAction === "cancel"
                    ? "btn-danger"
                    : "btn-success text-light"
                }`}
                onClick={() =>
                  modalAction === "cancel"
                    ? handleCancelReservation()
                    : handleMarkAsDone()
                }
                data-bs-dismiss="modal"
              >
                Yes, {modalAction === "cancel" ? "Cancel" : "Mark as Done"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrintingScheduleTable;


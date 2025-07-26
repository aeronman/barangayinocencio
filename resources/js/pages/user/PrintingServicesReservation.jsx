import React, { useRef, useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { useAPI } from "../../component/contexts/ApiContext";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from "react-router-dom";

function PrintingServicesReservation() {
  const { postData } = useAPI();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    reservation_date: "",
    address: "",
    email:"",
    contact_number: "",
    paper_size: "",
    color: "",
    file: null,
    purpose: "",
    reservation_code: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowAlert(false);
    
    if (!formRef.current.checkValidity()) {
      formRef.current.classList.add("was-validated");
      return;
    }
    
    setLoading(true);


    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "reservation_code") {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await postData(
        "printing-services",
        data,
        null,
        setLoading,
        setError
      );
      const reservationCode = response?.reservation_code || "N/A";

      setFormData((prev) => ({
        ...prev,
        reservation_code: reservationCode,
      }));

      setAlertMessage("Reservation submitted successfully!");
      const modal = new Modal(modalRef.current);
      modal.show();

      setFormData((prev) => ({
        name: "",
        reservation_date: "",
        address: "",
        contact_number: "",
        paper_size: "",
        color: "",
        file: null,
        purpose: "",
        reservation_code: prev.reservation_code,
      }));
    } catch (err) {
      console.error(err);
      setAlertMessage("There was an error submitting your reservation.");
    } finally {
      setLoading(false);
      setShowAlert(true);
    }
  };

  return (
    <>
      <div className="container my-5">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left-short"></i> Back
        </button>
        <div className="mb-3">
          <h1 className="text-center flex-grow-1">
            Printing Service Reservation
          </h1>
        </div>

        <div className="container mt-4 p-0">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Reservation Form</h4>
            </div>
            <div className="card-body">
              {showAlert && (
                <div
                  className={`alert alert-${
                    alertMessage.includes("success") ? "success" : "danger"
                  } alert-dismissible fade show`}
                  role="alert"
                >
                  {alertMessage}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAlert(false)}
                  ></button>
                </div>
              )}

              <form noValidate ref={formRef} onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Reservation Date</label>
                  <input
                    name="reservation_date"
                    type="date"
                    className="form-control"
                    value={formData.reservation_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Address{" "}
                    <span className="text-muted" style={{ fontSize: "0.8em" }}>
                      (House Block/Lot/Street/Barangay/Municipality)
                    </span>
                  </label>
                  <input
                    name="address"
                    type="text"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>


                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    name="contact_number"
                    type="tel"
                    className="form-control"
                    value={formData.contact_number}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        if (value.length <= 11) {
                          handleChange(e);
                        }
                      }
                    }}
                    maxLength={11}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Paper Size</label>
                  <select
                    name="paper_size"
                    className="form-select"
                    value={formData.paper_size}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Paper Size</option>
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Print Type</label>
                  <select
                    name="color"
                    className="form-select"
                    value={formData.color}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Print Type</option>
                    <option value="Colored">Colored</option>
                    <option value="Black & White">Black & White</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Upload file (PDF only)</label>
                  <input
                    name="file"
                    type="file"
                    className="form-control"
                    accept="application/pdf"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Note/Purpose (e.g., assignment, thesis, etc.)
                  </label>
                  <textarea
                    name="purpose"
                    className="form-control"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg text-light"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Reserve"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        tabIndex="-1"
        role="dialog"
        ref={modalRef}
        id="successModal"
        aria-labelledby="successModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="successModalLabel">
                Reservation Successful
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Your reservation was successful. Please check your email for
                confirmation.
              </p>
              <p>
                <strong>Reservation Code:</strong>{" "}
                <span className="text-primary">
                  {formData.reservation_code}
                </span>
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() =>
                  setTimeout(() => navigate("/services/printing"), 1000)
                }
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrintingServicesReservation;

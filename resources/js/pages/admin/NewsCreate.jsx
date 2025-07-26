import React, { useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { Modal } from "bootstrap";
import { useAPI } from "../../component/contexts/ApiContext";
import ModalPreview from "../../component/modals/ModalPreview";
import { useNavigate } from "react-router-dom";

function NewsCreate() {
  const { postData } = useAPI();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 2 * 1024 * 1024;

    const validFiles = files.filter((file) => file.size <= maxSize);
    
    if (validFiles.length !== files.length) {
      alert("Some images exceeded 2MB and were not added.");
    }

    setImages(validFiles);
    setImagePreviews(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const handlePreview = () => {
    const isValid = title.trim() && description.trim() && images.length > 0;
    setFormValid(true);
    if (isValid) {
      const modal = new Modal(document.getElementById("previewModal"));
      modal.show();
    }
  };

  const handleDiscard = () => {
    const modal = new Modal(document.getElementById("discardModal"));
    modal.show();
  };

  const discard = () => {
    setTitle("");
    setDescription("");
    setImages([]);
    setImagePreviews([]);
    setFormValid(false);
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const buildFormData = (status) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    images.forEach(img => formData.append("images[]", img));
    return formData;
  };

  const saveAsDraft = async () => {
    Modal.getInstance(document.getElementById("previewModal"))?.hide();
    try {
      await postData("news", buildFormData("draft"));
      showSuccessAlert("News saved as draft!");
    } catch (err) {
      console.error(err);
      alert("Failed to save draft.");
    } finally {
      discard();
    }
  };

  const confirmPublish = () => {
    const modal = new Modal(document.getElementById("confirmPublishModal"));
    modal.show();
  };

  const publishNews = async () => {
    Modal.getInstance(document.getElementById("previewModal"))?.hide();
    try {
      await postData("news", buildFormData("published"));
      showSuccessAlert("News published successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to publish news.");
    } finally {
      discard();
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="text-start mb-3">
        <button
          onClick={() => window.history.back()}
          className="btn btn-outline-primary py-1"
        >
          <i className="bi bi-arrow-left-short"></i> Go back
        </button>
      </div>
      <div className="mb-4 border-bottom pb-3">
        <h4 className="fw-bold">News & Updates</h4>
        <p className="text-muted m-0">
          Write and publish a new article effortlessly.
        </p>
      </div>

      {showAlert && (
        <div
          className={`alert alert-${
            alertMessage.includes("published") ? "success" : "warning"
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

      <form className="row g-4 needs-validation" noValidate>
        <div className="col-md-8">
          <div className="d-flex align-items-center mb-3">
            <span>Need A Registration Form?</span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm ms-3 py-0 px-3 fw-semibold"
              data-bs-toggle="modal"
              data-bs-target="#confirmationModal"
            >
              YES
            </button>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-bold text-dark">
              Title
            </label>
            <input
              type="text"
              className={`form-control ${
                formValid && !title ? "is-invalid" : ""
              }`}
              id="title"
              placeholder="Enter title..."
              maxLength="700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <small className="form-text text-muted">{`${title.length}/700 characters`}</small>
            <div className="invalid-feedback">
              Title is required (max 700 characters).
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="description"
              className="form-label fw-bold text-dark"
            >
              Description
            </label>
            <textarea
              className={`form-control ${
                formValid && !description ? "is-invalid" : ""
              }`}
              id="description"
              rows="15"
              placeholder="Enter detailed description..."
              maxLength="2000"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <small className="form-text text-muted">{`${description.length}/2000 characters`}</small>
            <div className="invalid-feedback">
              Description is required (max 2000 characters).
            </div>
          </div>
        </div>

        <div className="col-md-4 d-flex flex-column align-items-center">
          <label
            className="w-100 h-100 d-flex flex-column align-items-center justify-content-center border border-2 rounded-4 text-center p-4 bg-light-subtle position-relative upload-label"
            style={{ cursor: "pointer" }}
          >
            <i
              className="bi bi-images text-primary"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="text-muted m-0">Click to upload images</p>
            <input
              type="file"
              className="d-none"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div
                id="imagePreviewNewsCreateCarousel"
                className="carousel slide mt-3 w-100"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {imagePreviews.map((src, i) => (
                    <div
                      key={i}
                      className={`carousel-item ${i === 0 ? "active" : ""}`}
                    >
                      <img
                        src={
                          src.startsWith("http") || src.startsWith("blob:")
                            ? src
                            : `/storage/${src}`
                        }
                        alt={`Preview ${i + 1}`}
                        className="d-block w-100 img-fluid rounded-3"
                        style={{
                          height: "400px",
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {imagePreviews.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#imagePreviewNewsCreateCarousel"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                        style={{ filter: "invert(100%)" }}
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#imagePreviewNewsCreateCarousel"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                        style={{ filter: "invert(100%)" }}
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm mt-2 justify-content-center d-flex w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImages([]);
                    setImagePreviews([]);
                  }}
                >
                  <i className="bi bi-trash3"></i> Clear Images
                </button>
              </div>
            )}
          </label>
        </div>
      </form>

      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-danger fw-bold px-5 py-2"
          onClick={handleDiscard}
        >
          <i className="bi bi-x-circle"></i> Discard
        </button>
        <button
          className="btn btn-primary fw-bold text-white px-5 py-2 mx-2"
          onClick={handlePreview}
        >
          <i className="bi bi-eye"></i> Preview
        </button>
      </div>

      <ModalPreview
        id="previewModal"
        title={title}
        description={description}
        imagePreviews={imagePreviews}
        currentDate={currentDate}
        onSaveDraft={saveAsDraft}
        onPublish={confirmPublish}
      />

      <ModalDiscard id="discardModal" onConfirm={discard} />
      <ModalConfirmPublish id="confirmPublishModal" onConfirm={publishNews} />
      <ConfirmationModal />
    </>
  );
}

function ConfirmationModal() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="modal fade"
        id="confirmationModal"
        tabIndex="-1"
        aria-labelledby="confirmationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-primary text-white rounded-top-4">
              <h5 className="modal-title" id="confirmationModalLabel">
                Are you sure you want to leave this page?
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <p>If you leave this page, your changes may not be saved.</p>
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
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  navigate("/admin/events/manage");
                }}
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ModalDiscard({ id, onConfirm }) {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              Discard Changes?
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to discard all changes? This action cannot
              be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalConfirmPublish({ id, onConfirm }) {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              Confirm Publish
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p>Are you sure you want to publish this news article now?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              className="btn text-light btn-success"
              onClick={onConfirm}
              data-bs-dismiss="modal"
            >
              Yes, Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsCreate;

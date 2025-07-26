import React, { useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useAPI } from "../../component/contexts/ApiContext";
import ModalConfirmPublish from "../../component/modals/ModalConfirmPublish";
import ModalDiscard from "../../component/modals/ModalDiscard";
import ModalPreview from "../../component/modals/ModalPreview";

function EventCreate() {
  const { postData } = useAPI();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [eventDetails, setEventDetails] = useState({
    title: "",
    date: "",
    location: "",
    event_organizer: "",
    registration_start_date: "",
    registration_end_date: "",
    event_type: "",
    registration_type: "",
    requirements: "",
    description: "",
    time: "",
    contact_number: "",
    number_of_participants: "",
  });

  const [formValid, setFormValid] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const currentDate = new Date().toLocaleDateString();

  const titleCount = `${eventDetails.title.length}/100 characters`;
  const descriptionCount = `${eventDetails.description.length}/2000 characters`;

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePreview = () => {
    const form = document.querySelector(".needs-validation");
    const isValid =
      form.checkValidity() &&
      eventDetails.title.trim() !== "" &&
      eventDetails.date.trim() !== "" &&
      eventDetails.location.trim() !== "" &&
      eventDetails.event_organizer.trim() !== "" &&
      eventDetails.registration_start_date.trim() !== "" &&
      eventDetails.registration_end_date.trim() !== "" &&
      eventDetails.event_type.trim() !== "" &&
      eventDetails.description.trim() !== "" &&
      eventDetails.contact_number.trim() !== "" &&
      eventDetails.number_of_participants.trim() !== "" &&
      images.length > 0;

    setFormValid(isValid);
    form.classList.add("was-validated");

    if (isValid) {
      new Modal(document.getElementById("previewModal")).show();
    }
  };

  const handleDiscard = () => {
    new Modal(document.getElementById("discardModal")).show();
  };

  const discard = () => {
    setEventDetails({
      title: "",
      date: "",
      location: "",
      event_organizer: "",
      registration_start_date: "",
      registration_end_date: "",
      event_type: "",
      requirements: "",
      description: "",
      time: "",
      contact_number: "",
      number_of_participants: "",
    });
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
    formData.append("status", status);
    images.forEach((image) => formData.append("images[]", image));
    Object.entries(eventDetails).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    return formData;
  };

  const saveAsDraft = async () => {
    try {
      const formData = buildFormData("draft");
      await postData("events", formData);
      showSuccessAlert("Event saved as draft!");
      Modal.getInstance(document.getElementById("previewModal"))?.hide();
    } catch (err) {
      console.error(err);
      alert("Failed to save draft.");
    } finally {
      discard();
    }
  };

  const confirmPublish = () => {
    new Modal(document.getElementById("confirmPublishModal")).show();
  };

  const publishEvent = async () => {
    try {
      const formData = buildFormData("published");
      const response = await postData("events", formData, setLoading);
      if (response) {
        showSuccessAlert("Event published successfully!");
      }
      Modal.getInstance(document.getElementById("previewModal"))?.hide();
    } catch (err) {
      console.error(err);
      alert("Failed to publish event.");
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
        <h4 className="fw-bold">Create New Event</h4>
        <p className="text-muted m-0">
          Fill in the details below to create a new event.
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

      <form
        className={`row g-4 needs-validation ${
          formValid ? "was-validated" : ""
        }`}
        noValidate
      >
        <div className="col-md-8">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={eventDetails.title}
              maxLength="100"
              placeholder="Enter event title"
              onChange={handleInputChange}
              required
              aria-describedby="titleCount"
            />
            <small id="titleCount">{titleCount}</small>
            <div className="invalid-feedback">
              Title is required and must be under 100 characters.
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={eventDetails.date}
              onChange={handleInputChange}
              required
              aria-describedby="eventDateHelp"
            />
            <small id="eventDateHelp" className="form-text text-muted">
              Select the event date.
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={eventDetails.location}
              onChange={handleInputChange}
              placeholder="Enter event location"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="event_organizer" className="form-label">
              Event Organizer
            </label>
            <input
              type="text"
              className="form-control"
              id="event_organizer"
              name="event_organizer"
              value={eventDetails.event_organizer}
              onChange={handleInputChange}
              placeholder="Enter organizer name"
              required
            />
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="registration_start_date" className="form-label">
                  Registration Period (Start)
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="registration_start_date"
                  name="registration_start_date"
                  value={eventDetails.registration_start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="registration_end_date" className="form-label">
                  Registration Period (End)
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="registration_end_date"
                  name="registration_end_date"
                  value={eventDetails.registration_end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="event_type" className="form-label">
              Event Type
            </label>
            <input
              type="text"
              className="form-control"
              id="event_type"
              name="event_type"
              value={eventDetails.event_type}
              onChange={handleInputChange}
              placeholder="e.g., Seminar"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="registration_type" className="form-label">
              Registration Type
            </label>
            <select
              className="form-control"
              id="registration_type"
              name="registration_type"
              value={eventDetails.registration_type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select a type
              </option>
              <option value="group">Group</option>
              <option value="individual">Individual</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="requirements" className="form-label">
              Requirements
            </label>
            <input
              type="text"
              className="form-control"
              id="requirements"
              name="requirements"
              value={eventDetails.requirements}
              onChange={handleInputChange}
              placeholder="Enter event requirements"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={eventDetails.description}
              onChange={handleInputChange}
              rows="3"
              maxLength="2000"
              placeholder="Enter event description"
              required
              aria-describedby="descriptionCount"
            ></textarea>
            <small id="descriptionCount">{descriptionCount}</small>
          </div>

          <div className="mb-3">
            <label htmlFor="time" className="form-label">
              Time
            </label>
            <input
              type="time"
              className="form-control"
              id="time"
              name="time"
              value={eventDetails.time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact_number" className="form-label">
              Contact Number
            </label>
            <input
              type="tel"
              className="form-control"
              id="contact_number"
              name="contact_number"
              value={eventDetails.contact_number}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  if (value.length <= 11) {
                    handleInputChange(e);
                  }
                }
              }}
              maxLength={11}
              placeholder="Enter contact number"
              required
              aria-describedby="contactHelp"
            />
            <small id="contactHelp" className="form-text text-muted">
              Enter a valid contact number.
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="number_of_participants" className="form-label">
              Number of Participants
            </label>
            <input
              type="number"
              className="form-control"
              id="number_of_participants"
              name="number_of_participants"
              value={eventDetails.number_of_participants}
              onChange={handleInputChange}
              min="1"
              required
            />
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
              className={`d-none form-control ${
                formValid && images.length === 0 ? "is-invalid" : ""
              }`}
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div
                id="imagePreviewEventCreateCarousel"
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
                      data-bs-target="#imagePreviewEventCreateCarousel"
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
                      data-bs-target="#imagePreviewEventCreateCarousel"
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
            <div className="invalid-feedback">
              Image is required (max 5MB size per image).
            </div>
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
        title={eventDetails.title}
        description={eventDetails.description}
        imagePreviews={imagePreviews} // Pass imagePreviews correctly
        currentDate={currentDate}
        onSaveDraft={saveAsDraft}
        onPublish={confirmPublish}
      />
      <ModalDiscard id="discardModal" onConfirm={discard} />
      <ModalConfirmPublish id="confirmPublishModal" onConfirm={publishEvent} />
    </>
  );
}

export default EventCreate;

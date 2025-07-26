import React, { useState, useEffect } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useAPI } from "../../component/contexts/ApiContext";
import { useParams, useNavigate } from "react-router-dom";
import ModalPreview from "../../component/modals/ModalPreview";

function EventsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getData, postData } = useAPI();

  const [loading, setLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState({
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
    status: "",
  });

  const [formValid, setFormValid] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);

  const formatDate = (date) => date?.split("T")[0] || "";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getData(`events/${id}`);
        setEventDetails((prev) => ({ ...prev, ...res }));

        const imgs = Array.isArray(res.images)
          ? res.images
          : res.images
          ? [res.images]
          : [];

        setImagePreviews(imgs);
        setExistingImages(imgs);
      } catch (error) {
        console.error("Failed to fetch event data", error);
      }
    };

    if (id) fetchEvent();
  }, [id, getData]);

  const titleCount = `${eventDetails.title.length}/100 characters`;
  const descriptionCount = `${eventDetails.description.length}/2000 characters`;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter((file) => file.size <= maxSize);
    if (validFiles.length !== files.length) {
      alert("Some images exceeded 5MB and were not added.");
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    if (!imagesCleared) {
      setImages((prev) => [...validFiles, ...prev]);
      setImagePreviews((prev) => [...newPreviews, ...prev]);
    } else {
      setImages(validFiles);
      setImagePreviews(newPreviews);
      setImagesCleared(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreview = () => {
    const isValid = eventDetails.title.trim() && eventDetails.description.trim();
    setFormValid(true);
    if (isValid) {
      new Modal(document.getElementById("previewModal")).show();
    }
  };

  const showSuccessAlert = (message) => {
    setAlertType("success");
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const showFailedAlert = (message) => {
    setAlertType("danger");
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const handleUpdate = async (publish) => {
    if (!eventDetails.title.trim() || !eventDetails.description.trim()) {
      alert("Title and description are required!");
      return;
    }

    const formData = new FormData();
    Object.entries(eventDetails).forEach(([key, val]) => {
  if (key === "time" && val) {
    // Ensure format is HH:mm (removes any seconds if present)
    const [hour, minute] = val.split(":");
    const formattedTime = `${hour}:${minute}`;
    formData.append("time", formattedTime);
  } else if (key !== "status") {
    formData.append(key, val);
  }
});


    formData.append("status", publish ? "published" : eventDetails.status);
    formData.append("_method", "PUT");

   existingImages.forEach((img) => {
  formData.append("existing_images[]", img);
});


    images.forEach((file) => {
      formData.append("new_images[]", file);
    });

    try {
      const response = await postData(`events/${id}`, formData);
      if (response) {
        showSuccessAlert("Event updated successfully!");
        setTimeout(() => navigate("/admin/events"), 2000);
      } else {
        showFailedAlert("Failed to update event!");
      }
    } catch (error) {
      console.error("Update failed", error);
      showFailedAlert("Update failed. Please try again.");
    }
  };

const getImageURL = (src) => {
  if (!src) return "";
  return src.startsWith("http") || src.startsWith("blob:")
    ? src
    : `/storage/app/public/${src}`;
};



  return (
    <>
      <Breadcrumb />
      <div className="mb-4 border-bottom pb-3">
        <h4 className="fw-bold">Edit Event</h4>
        <p className="text-muted m-0">Update the details below for this event.</p>
      </div>

      {showAlert && (
        <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
          {alertMessage}
          <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
        </div>
      )}

      <form className="row g-4 needs-validation" noValidate>
        {/* LEFT SIDE FORM */}
        <div className="col-md-8">
          {[
            { label: "Title", name: "title", type: "text", maxLength: 100 },
            { label: "Location", name: "location", type: "text" },
            { label: "Event Organizer", name: "event_organizer", type: "text" },
            { label: "Event Type", name: "event_type", type: "text" },
            { label: "Requirements", name: "requirements", type: "text" },
            { label: "Contact Number", name: "contact_number", type: "tel" },
            { label: "Number of Participants", name: "number_of_participants", type: "number" },
          ].map(({ label, name, type, maxLength }) => (
            <div className="mb-3" key={name}>
              <label htmlFor={name} className="form-label fw-bold text-dark">{label}</label>
              <input
                type={type}
                className="form-control"
                name={name}
                value={eventDetails[name]}
                onChange={handleInputChange}
                maxLength={maxLength}
                required
              />
            </div>
          ))}

          <div className="row g-4">
            {["registration_start_date", "registration_end_date", "date"].map((name) => (
              <div className="col-md-4 mb-3" key={name}>
                <label className="form-label fw-bold text-dark">{name.replace(/_/g, " ").toUpperCase()}</label>
                <input
                  type="date"
                  name={name}
                  className="form-control"
                  value={formatDate(eventDetails[name])}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label htmlFor="time" className="form-label fw-bold text-dark">Time</label>
            <input
              type="time"
              className="form-control"
              name="time"
              value={eventDetails.time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-bold text-dark">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="5"
              value={eventDetails.description}
              onChange={handleInputChange}
              maxLength="2000"
              required
            />
            <small className="form-text text-muted">{descriptionCount}</small>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="col-md-4 d-flex flex-column align-items-center">
          <label className="w-100 d-flex flex-column align-items-center border p-4 rounded-3 bg-light-subtle">
            <i className="bi bi-images text-primary" style={{ fontSize: "3rem" }}></i>
            <p className="text-muted">Click to upload new images</p>
            <input
              type="file"
              className="d-none"
              accept="image/*"
              onChange={handleImageChange}
              multiple
            />
            {imagePreviews.length > 0 && (
              <div
                id="imagePreviewEventsEditCarousel"
                className="carousel slide mt-3 w-100"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                      <img
                        src={getImageURL(src)}
                        className="d-block w-100 img-fluid rounded-3"
                        style={{ height: "400px", objectFit: "contain" }}
                        alt={`Preview ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>

                {imagePreviews.length > 1 && (
                  <>
                    <button className="carousel-control-prev" type="button" data-bs-target="#imagePreviewEventsEditCarousel" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" style={{ filter: "invert(100%)" }}></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#imagePreviewEventsEditCarousel" data-bs-slide="next">
                      <span className="carousel-control-next-icon" style={{ filter: "invert(100%)" }}></span>
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
                    setExistingImages([]);
                    setImagesCleared(true);
                  }}
                >
                  <i className="bi bi-trash3"></i> Clear Images
                </button>
              </div>
            )}
          </label>
        </div>
      </form>

      {/* ACTION BUTTONS */}
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-primary fw-bold text-white px-5 py-2" onClick={handlePreview}>
          <i className="bi bi-eye"></i> Preview
        </button>
        <button className="btn btn-success fw-bold text-white px-5 py-2 mx-2" onClick={() => handleUpdate(false)}>
          <i className="bi bi-save"></i> Update
        </button>
        {eventDetails.status === "draft" && (
          <button className="btn btn-success fw-bold text-white px-5 py-2 mx-2" onClick={() => handleUpdate(true)}>
            <i className="bi bi-upload"></i> Publish
          </button>
        )}
      </div>

      <ModalPreview
        id="previewModal"
        title={eventDetails.title}
        description={eventDetails.description}
        imagePreviews={imagePreviews}
        currentDate={new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        status={eventDetails.status}
        onPublish={() => handleUpdate(true)}
      />
    </>
  );
}

export default EventsEdit;

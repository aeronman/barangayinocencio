import React, { useState, useEffect } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useAPI } from "../../component/contexts/ApiContext";
import { useParams, useNavigate } from "react-router-dom";
import ModalPreview from "../../component/modals/ModalPreview";

function AnnouncementsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getData, putData } = useAPI();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState(""); 
  const [imagesCleared, setImagesCleared] = useState(false);
  const [existingImages, setExistingImages] = useState([]);


useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await getData(`announcements/${id}`);
      setTitle(res.title);
      setDescription(res.description);
      setImagePreviews(res.images);
      setExistingImages(res.images); // Save original DB images
      setStatus(res.status); 
    } catch (error) {
      console.error("Failed to fetch announcements data", error);
    }
  };
  fetchNews();
}, [id, getData]);


  const titleCount = `${title.length}/700 characters`;
  const descriptionCount = `${description.length}/2000 characters`;

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
      setImagesCleared(false); // Reset after clearing
    }
  };

  const handlePreview = () => {
    const isValid = title.trim() !== "" && description.trim() !== "";
    setFormValid(true);
    if (isValid) {
      new Modal(document.getElementById("previewModal")).show();
    }
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

const handleUpdate = async (publish) => {
  if (!title.trim() || !description.trim()) {
    alert("Title and description are required!");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel expects _method override
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", publish ? "published" : status);

    existingImages.forEach((imgPath) => {
      formData.append("existing_images[]", imgPath);
    });

    images.forEach((file) => {
      formData.append("new_images[]", file);
    });

    await fetch(`/api/announcements/${id}`, {
      method: "POST", // send as POST
      body: formData,
    });

    showSuccessAlert("News updated successfully!");
    setTimeout(() => navigate("/admin/announcements"), 2000);
  } catch (error) {
    console.error("Update failed", error);
    alert("Failed to update announcements.");
  }
};




  return (
    <>
      <Breadcrumb />
      <div className="mb-4 border-bottom pb-3">
        <h4 className="fw-bold">Edit News</h4>
        <p className="text-muted m-0">Modify your article below.</p>
      </div>

      {showAlert && (
        <div
          className="alert alert-success alert-dismissible fade show"
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
            <small className="form-text text-muted">{titleCount}</small>
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
            <small className="form-text text-muted">{descriptionCount}</small>
          </div>
        </div>

        <div className="col-md-4">
          <label className="w-100 d-flex flex-column align-items-center border p-4 rounded-3 bg-light-subtle">
            <i
              className="bi bi-images text-primary"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="text-muted">Click to upload new images</p>
            <input
              type="file"
              className="d-none"
              accept="image/*"
              onChange={handleImageChange}
              multiple
            />
            {imagePreviews?.length > 0 && (
              <div
                id="imagePreviewAnnouncementEditCarousel"
                className="carousel slide mt-3 w-100"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {imagePreviews?.map((src, i) => (
                    <div
                      key={i}
                      className={`carousel-item ${i === 0 ? "active" : ""}`}
                    >
                      <img
                        src={
                          src.startsWith("http") || src.startsWith("blob:")
                            ? src
                            : `${import.meta.env.VITE_APP_BASE_URL || ""}/storage/app/public/${src}`

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
                      data-bs-target="#imagePreviewAnnouncementEditCarousel"
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
                      data-bs-target="#imagePreviewAnnouncementEditCarousel"
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
                    setExistingImages([]); // Also clear DB images
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

      <div className="d-flex justify-content-end mt-4">
        <button
          className="btn btn-primary fw-bold text-white px-5 py-2"
          onClick={handlePreview}
        >
          <i className="bi bi-eye"></i> Preview
        </button>
        <button
          className="btn btn-success fw-bold text-white px-5 py-2 mx-2"
          onClick={() => handleUpdate(false)}
        >
          <i className="bi bi-save"></i> Update
        </button>
        {status === "draft" && (
          <button
            className="btn btn-success fw-bold text-white px-5 py-2 mx-2"
            onClick={() => handleUpdate(true)}
          >
            <i className="bi bi-upload"></i> Publish
          </button>
        )}
      </div>

      <ModalPreview
        id="previewModal"
        title={title}
        description={description}
        imagePreviews={imagePreviews}
        currentDate={new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        status={status}
        onPublish={() => handleUpdate(true)}
      />
    </>
  );
}

export default AnnouncementsEdit;

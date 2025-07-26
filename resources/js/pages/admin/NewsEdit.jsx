// ✨ Updates below include image URL logic and consistent storage handling

import React, { useState, useEffect } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useAPI } from "../../component/contexts/ApiContext";
import { useParams, useNavigate } from "react-router-dom";
import ModalPreview from "../../component/modals/ModalPreview";

function NewsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
const { getData, postData } = useAPI();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [imagesCleared, setImagesCleared] = useState(false);
  const [existingImages, setExistingImages] = useState([]);



  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getData(`news/${id}`);
        setTitle(res.title);
        setDescription(res.description);
        setStatus(res.status);

        const imgs = Array.isArray(res.images)
          ? res.images
          : res.images
          ? [res.images]
          : [];

        setImagePreviews(imgs);
        setExistingImages(imgs);
      } catch (error) {
        console.error("Failed to fetch news data", error);
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
      setImagesCleared(false);
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
  if (!title.trim() || !description.trim()) {
    alert("Title and description are required!");
    return;
  }

  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("description", description.trim());
  formData.append("status", publish ? "published" : status);
  formData.append("_method", "PUT"); // Laravel will handle this as PUT

  existingImages.forEach((img) => {
    const relativePath = img.replace(/^.*\/storage\//, ""); // clean the URL
    formData.append("existing_images[]", relativePath);
  });

  images.forEach((file) => {
    formData.append("new_images[]", file);
  });

  try {
    const response = await postData(`news/${id}`, formData); // ✅ use POST
    if (response) {
      showSuccessAlert("News updated successfully!");
      setTimeout(() => navigate("/admin/news"), 2000);
    } else {
      showFailedAlert("Failed to update News!");
    }
  } catch (error) {
    console.error("Update failed", error);
    showFailedAlert("Update failed. Please try again.");
  }
};




  const getImageURL = (src) => {
    if (src.startsWith("http") || src.startsWith("blob:")) return src;
    return `${import.meta.env.VITE_APP_BASE_URL || ""}/storage/app/public/${src}`;
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
          className={`alert alert-${alertType} alert-dismissible fade show`}
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
            {imagePreviews.length > 0 && (
              <div
                id="imagePreviewNewsEditCarousel"
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
                        src={getImageURL(src)}
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
                      data-bs-target="#imagePreviewNewsEditCarousel"
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
                      data-bs-target="#imagePreviewNewsEditCarousel"
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

export default NewsEdit;

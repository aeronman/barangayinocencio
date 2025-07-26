import React from "react";

function ModalPreview({
  header = "Preview News Content",
  id,
  title,
  description,
  imagePreviews = [],
  currentDate,
  onSaveDraft,
  onPublish,
}) {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-primary" id={`${id}Label`}>
              {header}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <article>
              <h2 className="fw-bold">{title}</h2>
              <p className="text-muted">{currentDate}</p>
              {imagePreviews.length > 0 && (
                <div
                  id="imagePreviewModalCarousel"
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
                              : `/storage/app/public/${src}`
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
                        data-bs-target="#imagePreviewModalCarousel"
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
                        data-bs-target="#imagePreviewModalCarousel"
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
                </div>
              )}

              <p className="lead p-3">{description}</p>
            </article>
          </div>

          <div className="modal-footer">
            {onSaveDraft && (
              <button
                className="btn btn-warning fw-bold text-white px-4"
                onClick={onSaveDraft}
              >
                <i className="bi bi-save me-2"></i>Save as Draft
              </button>
            )}
            {onPublish && (
              <button
                className="btn btn-success fw-bold text-white px-4"
                onClick={onPublish}
              >
                <i className="bi bi-send me-2"></i>Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPreview;

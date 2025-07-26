import React, { useEffect, useState, useRef } from "react";
import { useAPI } from "./contexts/ApiContext";
import { Modal } from "bootstrap";

function Footer() {
  const { getData, postData } = useAPI();
  const [websiteInformation, setWebsiteInformation] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const fetchWebsiteInformation = async () => {
      try {
        await getData("settings", setWebsiteInformation, () => {}, setError);
      } catch (err) {
        console.error("Error fetching websiteInformation:", err);
      }
    };

    fetchWebsiteInformation();
  }, [getData]);

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postData("feedback", feedback, () => {}, setLoading, setError);
      setFeedback({ name: "", email: "", message: "" });
      new Modal(modalRef.current).show();
    } catch (err) {
      console.error("Error submitting feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="text-bg-primary">
        <div className="container d-flex py-4 flex-wrap">
          <div className="col-md-2 d-flex justify-content-center align-items-center mb-3 mb-md-0">
            <img
              src={
                websiteInformation.logo
                  ? websiteInformation.logo.startsWith("http") || websiteInformation.logo.startsWith("blob:")
                    ? websiteInformation.logo
                    : `/storage/${websiteInformation.logo}`
                  : "/images/Logo.png"
              }
              alt="Logo"
              className="img-fluid rounded-circle"
            />
          </div>

          <div className="col-md-7 d-flex justify-content-center align-items-center mb-3 mb-md-0">
            <div className="flex-column p-3">
              <div className="fs-1 text-uppercase fw-semibold mb-3">
                Contact Information
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-geo-alt-fill me-2"></i>
                <div>{websiteInformation.address || "Default Address"}</div>
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-telephone-fill me-2"></i>
                <div>{websiteInformation.phone_number || "Default Phone Number"}</div>
              </div>
              <div className="d-flex mb-3">
                <i className="bi bi-envelope-at-fill me-2"></i>
                <div>{websiteInformation.email || "Default Email"}</div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmitFeedback}
            className="col-md-3 d-flex justify-content-center align-items-center"
          >
            <div className="flex-column d-flex w-100 p-3">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={feedback.name}
                  onChange={handleFeedbackChange}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={feedback.email}
                  onChange={handleFeedbackChange}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Write your message here"
                  name="message"
                  value={feedback.message}
                  onChange={handleFeedbackChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-success text-light text-uppercase"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending...
                  </>
                ) : (
                  "Send Feedback"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-success text-light text-center fs-4">
        &copy; 2025. Batang Inocencio. All Rights Reserved.
      </div>

      {/* Bootstrap Modal */}
      <div
        className="modal fade"
        tabIndex="-1"
        ref={modalRef}
        aria-labelledby="feedbackThankYou"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="feedbackThankYou">
                Thank You!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <p className="fs-5">
                Thank you for reaching out and providing us with valuable
                feedback!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

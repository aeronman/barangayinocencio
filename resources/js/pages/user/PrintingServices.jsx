import React from "react";
import { Link } from "react-router-dom";

function PrintingServices() {
  return (
    <>
      <div className="text-center">
        <Link
          to="/services/printing/reservation"
          className="btn text-light rounded-pill btn-success btn-lg px-5 py-2 fw-bold my-3 fs-1 my-5"
        >
          Reserve Here
        </Link>
      </div>

      <div className="container col-8 d-flex flex-column justify-content-center py-5">
        <img
          src="/images/printing-rules.png"
          className="img-fluid w-100 h-100 object-fit-fill"
          alt="Illustration Image"
        />
      </div>

      <div className="container col-8 d-flex flex-column justify-content-center py-5">

      <h1 className="text-center mb-4">Guidelines and Rules</h1>
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4>Important Information</h4>
          </div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <i className="bi bi-facebook me-2"></i> Follow the{" "}
                <a
                  href="https://www.facebook.com/Sangguniang-Kabataan-Brgy-Inocencio"
                  target="_blank"
                  className="fw-bold"
                >
                  Sangguniang Kabataan - Brgy. Inocencio on Facebook
                </a>
                .
              </li>
              <li className="list-group-item">
                <i className="bi bi-person-circle me-2"></i> Available for ages{" "}
                <strong>15-20 years old</strong> only.
              </li>
              <li className="list-group-item">
                <i className="bi bi-card-checklist me-2"></i> Present your{" "}
                <strong>School ID</strong> or any ID that has your address.
              </li>
              <li className="list-group-item">
                <i className="bi bi-file-earmark-text me-2"></i> Free{" "}
                <strong>pages of bond paper</strong> per student. Please bring{" "}
                <strong>10 bottles</strong> if it exceeds more than 10 bond
                papers.
              </li>
              <li className="list-group-item">
                <i className="bi bi-book me-2"></i> For educational purposes only or
                for <strong>resume/CV printing</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrintingServices;

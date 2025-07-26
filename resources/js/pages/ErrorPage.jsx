import React from "react";
import { Link, useLocation } from "react-router-dom";

function ErrorPage({ statusCode }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-primary text-white text-center p-4">
        <img
          src="/images/Logo.png"
          alt="Logo"
          width="110"
          height="100"
          className="mb-4"
        />
        <h1 className="display-1 fw-bold">{statusCode}</h1>
        <p className="fs-5 mb-4">
          Oops! The page you’re looking for doesn’t exist or may have been
          moved.
        </p>
        <p className="fs-6">
          Please check the URL or try one of the following options:
        </p>
        <ul className="list-unstyled mt-4">
          <li className="mb-3">
            <button
              onClick={() => window.history.back()}
              className="btn btn-lg btn-outline-light rounded-4 px-4 btn-small"
            >
              Go back to the previous page
            </button>
          </li>
          <li className="mb-3">
            <Link
              to={isAdminPath ? "/admin/dashboard" : "/"}
              className="btn btn-lg btn-outline-light rounded-4 px-4 btn-small"
            >
              Go to Home Page
            </Link>
          </li>
          <li className="">
            If you believe this is an error, please contact the Developer.
          </li>
        </ul>
      </div>
    </>
  );
}

export default ErrorPage;

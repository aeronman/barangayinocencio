import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./../css/main.css";
import "./../css/custom.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./route";
import { APIProvider } from "./component/contexts/ApiContext";

// localStorage.removeItem("auth_token");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <APIProvider>
        <App />
      </APIProvider>
    </BrowserRouter>
  </React.StrictMode>
);

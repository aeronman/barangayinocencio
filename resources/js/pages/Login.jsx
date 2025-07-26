import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await api.post("login", {
        username,
        password,
      });
      localStorage.setItem("auth_token", response.data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light">
      <div
        className="card border-0 shadow-lg p-4 rounded-4"
        style={{ width: "400px" }}
      >
        <div className="text-center mb-3">
          <h1 className="fw-bold">Login</h1>
          <p className="text-muted">Welcome back!</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 text-center">{errorMsg}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-grow spinner-grow-sm me-2"
                  role="status"
                  
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Forgot password? <Link to="#">Reset here</Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;

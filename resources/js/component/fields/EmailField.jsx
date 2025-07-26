import { useState } from "react";
import { useAPI } from "../contexts/ApiContext";

function EmailField({ formData, handleChange, onValidate }) {
  const { postData } = useAPI();
  const [checking, setChecking] = useState(false);
  const [validated, setValidated] = useState(null);
  const [message, setMessage] = useState("");

  const isValidEmailFormat = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const checkEmail = async () => {
    if (!isValidEmailFormat(formData.email)) {
      setValidated(false);
      setMessage("⚠️ Please enter a valid email address.");
      onValidate(false);
      return;
    }

    setChecking(true);
    setMessage("");
    try {
      const response = await postData("check-email", {
        email: formData.email,
      });

      const isValid = response?.available ?? false;

      setValidated(isValid);
      setMessage(
        isValid ? "✅ Email is available." : "❌ Email is already taken."
      );
      onValidate(isValid);
    } catch (error) {
      setValidated(false);
      setMessage("⚠️ An error occurred. Please try again.");
      onValidate(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="email" className="form-label">
        Email Address
      </label>
        <span>
          <div className={`form-text text-danger`}>
            Please check your email before to proceed!
          </div>
        </span>
      <div className="input-group">
        <input
          id="email"
          type="email"
          name="email"
          className={`form-control ${validated === false ? "is-invalid" : ""}`}
          value={formData.email}
          onChange={(e) => {
            handleChange(e);
            setValidated(null);
            setMessage("");
            onValidate(null);
          }}
          required
        />
        
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={checkEmail}
          disabled={checking || !formData.email}
        >
          {checking ? "Checking..." : "Check"}
        </button>
      </div>
      {message && (
        <div
          className={`form-text ${
            validated === true ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default EmailField;

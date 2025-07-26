import React, { useEffect, useState, useRef } from "react";
import { useAPI } from "../../component/contexts/ApiContext";
import ModalSuccessfulRegistration from "../../component/modals/ModalSuccessfulRegistration";
import EmailField from "../../component/fields/EmailField";
import AgeField from "../../component/fields/AgeField";

const formFields = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  sex: "",
  age: "",
  age_group: "",
  address: "",
  area: "",
  civil_status: "",
  contact_number: "",
  email: "",
  education: "",
  national_voter: "",
  sk_voter: "",
  election_vote: "",
  kk_assembly: "",
  kk_reason: "",
  kk_ttendances: "",
  recommendations: "",
  project_recommendations: "",
  youth_concerns: "",
};

const areaOptions = [
  "Inocencio Proper",
  "Tradition Homes Phase 1 and 2",
  "Sampaguita Village",
  "Regina Ville 2000",
  "BRIA Homes",
  "South Ville Phase 1A and B",
];

const genderOptions = ["Male", "Female"];

const civilStatusOptions = [
  "Single",
  "Married",
  "Widowed",
  "Divorced",
  "Annulled",
  "Live-in",
];

const ageGroupOptions = [
  "Child Youth (15-17)",
  "Core Youth (18-24)",
  "Young Adult (25-30)",
];

const educationOptions = [
  "Elementary Level",
  "Elementary Graduate",
  "High School Level",
  "High School Graduate",
  "College Level",
  "College Graduate",
  "Master's Graduate",
  "Doctorate Level",
  "Doctorate Graduate",
  "Out of School",
  "Unemployed",
  "Employed",
];

const suffixOptions = [
  "",
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV",
  "Ph.D.",
  "M.D.",
  "D.D.S.",
  "Esq.",
  "CPA",
  "RN",
];

const yesNoOptions = ["Yes", "No"];

const kkAttendanceOptions = ["1-2 Times", "3-4 Times", "5 and Above"];

const kkReasonOptions = [
  "No KK Assembly",
  "Not aware about KK Assembly",
  "Not Interested",
];

const MembershipRegistration = () => {
  const { postData } = useAPI();
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(formFields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isAgeValid, setIsAgeValid] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) =>
      type === "checkbox"
        ? {
            ...prev,
            [name]: checked
              ? [...prev[name], value]
              : prev[name].filter((v) => v !== value),
          }
        : { ...prev, [name]: type === "radio" ? value : checked || value }
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await postData(
        "members",
        formData,
        setFormData,
        setLoading,
        setError
      );
      setShowModal(true);
    } catch (error) {
      console.error("Submission failed", error);
      setShowModal(false);
    }
  };

  const renderRadioButtons = (name, options) =>
    options.map((option) => (
      <div key={option} className="form-check">
        <input
          type="radio"
          name={name}
          value={option || ""}
          checked={formData[name] === option}
          onChange={handleChange}
          required
          className="form-check-input"
        />
        <label className="form-check-label">{option}</label>
      </div>
    ));

  const onPrev = () => setPage(page - 1);

  const onNext = () => {
    const form = formRef.current;
    if (form.checkValidity() === false) {
      form.classList.add("was-validated");
      if (!isAgeValid) {
        form.classList.add("was-validated");
        return;
      }
      if (!isEmailValid) {
        form.classList.add("was-validated");
        return;
      }
    }
    setPage(page + 1);
  };

  const onFinish = () => {
    handleSubmit();
  };

  return (
    <>
      <div className="container p-5">
        <div
          className="progress mb-3 w-75 mx-auto"
          role="progressbar"
          aria-label="Basic example"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-bar"
            style={{ width: `${(page / 5) * 100}%` }}
          ></div>
        </div>
        {page === 1 && (
          <div className="page active">
            <div className="card border-top border-0 shadow-lg mb-5 rounded-4 w-75 mx-auto">
              <div className="card-body p-5">
                <div className="p-4">
                  <h2 className="text-center fw-bold mb-4 text-primary">
                    YOUTH PROFILING OF KATIPUNAN NG KABATAAN (KK)
                  </h2>
                  <div className="container my-5">
                    <h5 className="card-title text-primary fw-bold">
                      Good day, Youth!
                    </h5>
                    <p className="card-text">
                      The <strong>Sangguniang Kabataan (SK)</strong> of Barangay
                      Inocencio is currently gathering important demographic
                      information of the members of the{" "}
                      <strong>Katipunan ng Kabataan (KK)</strong> who are aged{" "}
                      <strong>15–30 years old</strong>.
                    </p>
                    <p className="card-text">
                      Therefore, we would like to ask for your participation by
                      answering this Form.
                    </p>
                    <p className="card-text">
                      Please read each question carefully and answer them
                      correctly. Rest assured that all information gathered from
                      this will be treated{" "}
                      <strong>private and confidential</strong>.
                    </p>
                    <p className="card-text mb-0">
                      Thank you very much, <strong>Batang Inocencio!</strong>
                    </p>
                  </div>

                  <form
                    ref={formRef}
                    className="row g-3 needs-validation"
                    noValidate
                  >
                    <div className="form-check my-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="agreeToTerms"
                        id="agreeCheck"
                        required
                      />
                      <label
                        htmlFor="agreeCheck"
                        className="form-check-label text-muted"
                      >
                        I agree to provide my details for registration.
                      </label>
                      <div className="invalid-feedback">
                        You must agree before submitting.
                      </div>
                    </div>
                  </form>

                  <button
                    className="btn btn-primary w-100 fw-bold py-2 mt-4"
                    onClick={onNext}
                  >
                    <i className="bi bi-pencil-square"></i> Fill Out
                    Registration Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {page === 2 && (
          <div className="page">
            <div className="card border-top border-0 shadow-lg mb-5 rounded-4 w-75 mx-auto">
              <div className="card-body p-5">
                <div className="p-4">
                  <h2 className="text-center fw-bold mb-4 text-primary">
                    YOUTH PROFILING OF KATIPUNAN NG KABATAAN (KK)
                  </h2>
                  <h4 className="text-center mb-4 text-muted">A. Profile</h4>

                  <form ref={formRef} className="needs-validation" noValidate>
                    {["last_name", "first_name"].map((field) => (
                      <div className="mb-3" key={field}>
                        <label className="form-label">
                          {field
                            .replace(/_/g, " ")
                            .replace(/([A-Z])/g, " $1")
                            .toUpperCase()}
                        </label>
                        <input
                          type="text"
                          name={field}
                          className="form-control"
                          value={formData[field] || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}
                    {["middle_name"]?.map((field) => (
                      <div className="mb-3" key={field}>
                        <label className="form-label">
                          {field
                            .replace(/_/g, " ")
                            .replace(/([A-Z])/g, " $1")
                            .toUpperCase()}
                        </label>
                        <input
                          type="text"
                          name={field}
                          className="form-control"
                          value={formData[field] || ""}
                          onChange={handleChange}
                        />
                      </div>
                    ))}

                    <div className="mb-3">
                      <label className="form-label" htmlFor="suffixSelect">
                        Suffix
                      </label>
                      <select
                        className="form-select"
                        id="suffixSelect"
                        name="suffix"
                        value={formData.suffix || ""}
                        onChange={handleChange}
                      >
                        <option value="">Choose...</option>
                        {suffixOptions.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option || "None"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {["address"].map((field) => (
                      <div className="mb-3" key={field}>
                        <label className="form-label">
                          {field
                            .replace(/_/g, " ")
                            .replace(/([A-Z])/g, " $1")
                            .toUpperCase()}
                        </label>
                        <input
                          type="text"
                          name={field}
                          className="form-control"
                          value={formData[field] || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}
                    <fieldset className="mb-3">
                      <legend className="form-label">Inocencio Area</legend>
                      {areaOptions.map((area) => (
                        <div key={area} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="area"
                            value={area || ""}
                            checked={formData.area === area}
                            onChange={handleChange}
                            required
                          />
                          <label className="form-check-label">{area}</label>
                        </div>
                      ))}
                    </fieldset>
                    <div className="mb-3">
                      <legend className="form-label">
                        Sex Assigned at Birth
                      </legend>
                      {renderRadioButtons("sex", genderOptions)}
                    </div>
                    <AgeField
                      formData={formData}
                      handleChange={handleChange}
                      onValidate={setIsAgeValid}
                    />
                    <EmailField
                      formData={formData}
                      handleChange={handleChange}
                      onValidate={setIsEmailValid}
                      validate={isEmailValid}
                    />
                    <div className="mb-3">
                      <label className="form-label">Contact Number</label>
                      <input
                        type="number"
                        name="contact_number"
                        className="form-control"
                        value={formData.contact_number || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            if (value.length <= 11) {
                              handleChange(e);
                            }
                          }
                        }}
                        maxLength={11}
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={onPrev}
                      >
                        Back
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={onNext}
                        disabled={!isEmailValid || !isAgeValid}
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {page === 3 && (
          <div className="page">
            <div className="card border-top border-0 shadow-lg mb-5 rounded-4 w-75 mx-auto">
              <div className="card-body p-5">
                <div className="p-4">
                  <h2 className="text-center fw-bold mb-4 text-primary">
                    YOUTH PROFILING OF KATIPUNAN NG KABATAAN (KK)
                  </h2>
                  <h4 className="text-center mb-4 text-muted">
                    B. Demographic Characteristics
                  </h4>

                  <form ref={formRef} className="needs-validation" noValidate>
                    <div className="mb-3">
                      <legend className="form-label">Civil Status</legend>
                      {renderRadioButtons("civil_status", civilStatusOptions)}
                    </div>

                    <div className="mb-3">
                      <legend className="form-label">Youth Age Group</legend>
                      {renderRadioButtons("age_group", ageGroupOptions)}
                    </div>

                    <div className="mb-3">
                      <legend className="form-label">
                        Educational Background
                      </legend>
                      {renderRadioButtons("education", educationOptions)}
                    </div>

                    <div className="mb-3">
                      <legend className="form-label">
                        Are you a registered SK Voter?
                      </legend>
                      {renderRadioButtons("sk_voter", yesNoOptions)}
                    </div>

                    <div className="mb-3">
                      <legend className="form-label">
                        Did you vote in the Barangay and SK elections of 2023?
                      </legend>
                      {renderRadioButtons("election_vote", yesNoOptions)}
                    </div>

                    <div className="mb-3">
                      <legend className="form-label">
                        Are you a registered National Voter?
                      </legend>
                      {renderRadioButtons("national_voter", yesNoOptions)}
                    </div>

                    <div className="mb-3">
                      <legend className="form-label">
                        Have you ever attended a Katipunan ng Kabataan (KK)
                        Assembly Meeting?
                      </legend>
                      {renderRadioButtons("kk_assembly", yesNoOptions)}
                    </div>

                    <div className="mb-3 ps-3">
                      {formData.kk_assembly === "Yes" &&
                        renderRadioButtons(
                          "kk_ttendances",
                          kkAttendanceOptions
                        )}
                    </div>

                    <div className="mb-3 ps-3">
                      {formData.kk_assembly === "No" &&
                        renderRadioButtons("kk_reason", kkReasonOptions)}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={onPrev}
                      >
                        Back
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={onNext}
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === 4 && (
          <div className="page">
            <div className="card border-top border-0 shadow-lg mb-5 rounded-4 w-75 mx-auto">
              <div className="card-body p-5">
                <div className="p-4">
                  <h2 className="text-center fw-bold mb-4 text-primary">
                    YOUTH PROFILING OF KATIPUNAN NG KABATAAN (KK)
                  </h2>
                  <h4 className="text-center mb-4 text-muted">C. Others</h4>

                  <form ref={formRef} className="needs-validation" noValidate>
                    <div className="mb-3">
                      <label className="form-label">
                        Specific concerns/issues as a youth (provide at least 2
                        issues)
                      </label>
                      <textarea
                        className="form-control"
                        name="youth_concerns"
                        rows="4"
                        placeholder="Enter at least 2 issues or concerns you have as a youth."
                        value={formData.youth_concerns || ""}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <div className="invalid-feedback">
                        Please provide at least 2 youth concerns.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Recommendations to address the issues identified
                      </label>
                      <textarea
                        className="form-control"
                        name="recommendations"
                        rows="4"
                        placeholder="Provide recommendations to address the issues you mentioned."
                        value={formData.recommendations || ""}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <div className="invalid-feedback">
                        Please provide recommendations.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Recommendation Project/s for SK Inocencio
                      </label>
                      <textarea
                        className="form-control"
                        name="project_recommendations"
                        rows="4"
                        placeholder="Provide recommendation projects that could benefit SK Inocencio."
                        value={formData.project_recommendations || ""}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <div className="invalid-feedback">
                        Please provide at least one project recommendation.
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={onPrev}
                      >
                        Back
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={onNext}
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {page === 5 && (
          <div className="page">
            <div className="card border-top border-0 shadow-lg mb-5 rounded-4 w-75 mx-auto">
              <div className="card-body p-5">
                <div className="p-4">
                  <h2 className="text-center fw-bold mb-4 text-primary">
                    YOUTH PROFILING OF KATIPUNAN NG KABATAAN (KK)
                  </h2>
                  <h4 className="text-center mb-4 text-muted">
                    Final Confirmation
                  </h4>
                  <p className="text-muted text-justify">
                    <strong>
                      Thank you for completing the Youth Profiling Registration!
                    </strong>{" "}
                    Your responses will help improve SK's programs and services
                    for the youth of Inocencio. A confirmation email will be
                    sent to your provided email.
                  </p>

                  {error && (
                    <div className="alert alert-danger py-2 text-center">
                      {error}
                    </div>
                  )}

                  {loading ? (
                    <div className="text-center mt-4">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <div className="mt-2 text-muted fw-semibold">
                        Processing your submission...
                      </div>
                    </div>
                  ) : (
                    <div className="text-center mt-4">
                      <button
                        className="btn btn-success text-light w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                        type="button"
                        onClick={onFinish}
                      >
                        <i className="bi bi-check-circle-fill fs-5"></i>
                        <span>Submit & Finish</span>
                      </button>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={onPrev}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ModalSuccessfulRegistration
          showModal={showModal}
          setShowModal={setShowModal}
          title="KK Membership Registration Successful!"
          body="Welcome to the Katipunan ng Kabataan! Your membership registration has been submitted successfully. Stay tuned for updates and upcoming youth activities in your barangay."
          redirect="membership"
        />
      </div>
    </>
  );
};

export default MembershipRegistration;

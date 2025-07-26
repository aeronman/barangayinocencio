import React, { useEffect, useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import { useAPI } from "../../component/contexts/ApiContext";

function Settings() {
  const { getData, postData } = useAPI();

  const [formData, setFormData] = useState({
    website_name: "",
    logo: null,
    address: "",
    phone_number: "",
    email: "",
    mission: "",
    vision: "",
    chairperson: { name: "", position: "Chairperson", image: null },
    committeeMembers: [{ name: "", position: "", image: null }],
  });

  const [faqItems, setFaqItems] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const settings = await getData("settings");
        if (settings) {
          setFormData({
            website_name: settings.website_name || "",
            logo: null,
            address: settings.address || "",
            phone_number: settings.phone_number || "",
            email: settings.email || "",
            mission: settings.mission || "",
            vision: settings.vision || "",
            chairperson: {
              name: settings.chairperson_name || "",
              position: settings.chairperson_position || "Chairperson",
              image: null, // force to null (File only from file input)
            },
            committeeMembers: (settings.committee_members || []).map(
              (member) => ({
                name: member.name || "",
                position: member.position || "",
                image: null, // ensure no invalid image value
              })
            ),
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        showErrorAlert("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [getData]);

  useEffect(() => {
    getData("faqs", setFaqItems, setLoading, setError);
  }, [getData]);

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.committeeMembers];
    updated[index][field] = value;
    setFormData({ ...formData, committeeMembers: updated });
  };

  const handleAddMember = () => {
    setFormData({
      ...formData,
      committeeMembers: [
        ...formData.committeeMembers,
        { name: "", position: "", image: null },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    const form = new FormData();
    form.append("website_name", formData.website_name);
    form.append("address", formData.address);
    form.append("phone_number", formData.phone_number);
    form.append("email", formData.email);
    form.append("mission", formData.mission);
    form.append("vision", formData.vision);
    form.append("chairperson_name", formData.chairperson.name);
    form.append("chairperson_position", formData.chairperson.position);
    if (formData.chairperson.image) {
      form.append("chairperson_image", formData.chairperson.image);
    }
    if (formData.logo) {
      form.append("logo", formData.logo);
    }

    formData.committeeMembers.forEach((member, index) => {
      form.append(`committeeMembers[${index}][name]`, member.name);
      form.append(`committeeMembers[${index}][position]`, member.position);
      if (member.image) {
        form.append(`committeeMembers[${index}][image]`, member.image);
      }
    });
    
    faqItems.forEach((faq, index) => {
      form.append(`faqs[${index}][question]`, faq.question);
      form.append(`faqs[${index}][answer]`, faq.answer);
    });
  
    try {
      await postData("/settings/save", form, null, setLoading);
      showSuccessAlert("Website Information Updated Successfully");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error saving website info:", error);
      showErrorAlert("Error updating settings.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="container py-4">
        <h2 className="fw-bold mb-4 text-primary">Website Settings</h2>

        {showAlert && (
          <div
            className={`alert alert-dismissible fade show ${
              alertMessage.includes("Error") ? "alert-danger" : "alert-success"
            }`}
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4 p-4 bg-white rounded-3 shadow-lg border">
            <h5 className="mb-3 text-secondary">Website Information</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Logo</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.files[0] })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Website Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.website_name}
                  onChange={(e) =>
                    setFormData({ ...formData, website_name: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-4 p-4 bg-white rounded-3 shadow-lg border">
            <h5 className="mb-3 text-secondary">Contact Information</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mb-4 p-4 bg-white rounded-3 shadow-lg border">
            <h5 className="mb-3 text-secondary">Mission & Vision</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Mission</label>
                <textarea
                  rows="5"
                  className="form-control"
                  value={formData.mission}
                  onChange={(e) =>
                    setFormData({ ...formData, mission: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Vision</label>
                <textarea
                  rows="5"
                  className="form-control"
                  value={formData.vision}
                  onChange={(e) =>
                    setFormData({ ...formData, vision: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Org Chart - Committee Members */}
          <div className="mb-4 p-4 bg-white rounded-3 shadow-lg border">
            <h5 className="mb-3 text-secondary mb-5">Organizational Chart</h5>

            <h6 className="mb-3 text-secondary">SK Chairperson</h6>
            <div className="row g-3 mb-5">
              <div className="col-md-4">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.chairperson.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chairperson: {
                        ...formData.chairperson,
                        name: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.chairperson.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chairperson: {
                        ...formData.chairperson,
                        position: e.target.value,
                      },
                    })
                  }
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chairperson: {
                        ...formData.chairperson,
                        image: e.target.files[0],
                      },
                    })
                  }
                />
              </div>
            </div>

            <h6 className="text-muted">Committee Members</h6>

            {formData.committeeMembers.map((member, index) => (
              <div className="row g-3 mb-3" key={index}>
                <div className="col-md-4">
                  <label className="form-label">Member Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={member.name}
                    onChange={(e) =>
                      handleMemberChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Member Position</label>
                  <input
                    type="text"
                    className="form-control"
                    value={member.position}
                    onChange={(e) =>
                      handleMemberChange(index, "position", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Member Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      handleMemberChange(index, "image", e.target.files[0])
                    }
                  />
                </div>
              </div>
            ))}

            <div className="mt-3">
              <button
                type="button"
                className="btn btn-sm btn-success text-light me-2"
                onClick={handleAddMember}
              >
                Add Member
              </button>
            </div>
          </div>

          {/* <p class="d-inline-flex gap-1">
            <a
              class="btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Link with href
            </a>
            <button
              class="btn btn-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Button with data-bs-target
            </button>
          </p>
          <div class="collapse" id="collapseExample">
            <div class="card card-body">
              Some placeholder content for the collapse component. This panel is
              hidden by default but revealed when the user activates the
              relevant trigger.
            </div>
          </div> */}

          <div className="mb-4 p-4 bg-white rounded-3 shadow-lg border">
            <h5 className="mb-3 text-secondary">Frequently Asked Questions</h5>
            <div className="accordion" id="faqAccordion">
              {faqItems.map((item, index) => {
                const collapseId = `collapseAnswer${index}`;
                const headingId = `heading${index}`;
                return (
                  <div className="accordion-item" key={index}>
                    <h2 className="accordion-header" id={headingId}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded="false"
                        aria-controls={collapseId}
                      >
                        {item.question || `Question ${index + 1}`}
                      </button>
                    </h2>
                    <div
                      id={collapseId}
                      className="accordion-collapse collapse"
                      aria-labelledby={headingId}
                      // Removed data-bs-parent here to allow toggle close
                    >
                      <div className="accordion-body">
                        <div className="mb-3">
                          <label className="form-label">Question</label>
                          <input
                            type="text"
                            className="form-control"
                            value={item.question}
                            onChange={(e) => {
                              const updatedFaqs = [...faqItems];
                              updatedFaqs[index].question = e.target.value;
                              setFaqItems(updatedFaqs);
                            }}
                            placeholder="Enter your question here"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Answer</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={item.answer}
                            onChange={(e) => {
                              const updatedFaqs = [...faqItems];
                              updatedFaqs[index].answer = e.target.value;
                              setFaqItems(updatedFaqs);
                            }}
                            placeholder="Enter the answer here"
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            const updatedFaqs = faqItems.filter(
                              (_, i) => i !== index
                            );
                            setFaqItems(updatedFaqs);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary mt-3"
              onClick={() =>
                setFaqItems([...faqItems, { question: "", answer: "" }])
              }
            >
              Add FAQ
            </button>
          </div>

          <div className="col-12">
            <button
              className="btn btn-lg btn-primary ms-auto d-flex"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div
        className={`modal fade ${showConfirmModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Changes</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowConfirmModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to save these changes?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Yes, Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;

import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";
import ModalSuccessfulRegistration from "../../component/modals/ModalSuccessfulRegistration";

const EventRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getData, postData } = useAPI();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [showModal, setShowModal] = useState(false);
  const [event, setEvent] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const formRef = useRef(null);

  const [teamFormData, setTeamFormData] = useState({
    event_id: id,
    team_name: "",
    leader_name: "",
    leader_age: "",
    leader_contact: "",
    leader_email: "",
    members: [{ name: "", age: "", contact: "", email: "" }],
  });

  const [participantFormData, setParticipantFormData] = useState({
    event_id: id,
    last_name: "",
    first_name: "",
    address: "",
    email: "",
    contact_number: "",
  });

  const isEventRegistrationPageActive = () =>
    location.pathname.startsWith("/registration");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(`events/${id}`, setLoading, setError);
      setEvent(data);
    };
    fetchData();
  }, []);

  const handleTeamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTeamFormData({
      ...teamFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleParticipantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParticipantFormData({
      ...participantFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...teamFormData.members];
    updatedMembers[index][field] = value;
    setTeamFormData({ ...teamFormData, members: updatedMembers });
  };

  const addMember = () => {
    setTeamFormData({
      ...teamFormData,
      members: [
        ...teamFormData.members,
        { name: "", age: "", contact: "", email: "" },
      ],
    });
  };

  const removeMember = () => {
    setTeamFormData((prevData) => ({
      ...prevData,
      members: prevData.members.slice(0, -1),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    try {
      if (event.registration_type == "group") {
        postData("teams", teamFormData, setTeamFormData, setLoading, setError);
        setTeamFormData({
          team_name: "",
          leader_name: "",
          leader_age: "",
          leader_contact: "",
          leader_email: "",
          members: [],
        });
      } else {
        postData(
          "participants",
          participantFormData,
          setParticipantFormData,
          setLoading,
          setError
        );
        setParticipantFormData({
          name: "",
          age: "",
          contact: "",
          email: "",
        });
      }
      form.classList.remove("was-validated");
      setShowModal(true);
    } catch {
      setShowModal(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!formRef.current) return;

    const form = formRef.current;

    const handleValidation = (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    };

    form.addEventListener("submit", handleValidation);

    return () => {
      form.removeEventListener("submit", handleValidation);
    };
  }, []);

  if (!event) {
    return (
      <div className="container text-center my-5">
        <h3 className="text-danger">Event not found</h3>
        <button
          onClick={() => window.history.back()}
          className="btn btn-outline-primary"
        >
          Go back to the previous page
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-transparent p-0">
          <li className="breadcrumb-item">
            <a href="/events" className="text-primary fw-semibold">
              Events
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href={`/events/${id}`} className="text-primary fw-semibold">
              Details
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Registration
          </li>
        </ol>
      </nav>

      <div className="row px-3">
        <div className="col-md-8 px-3">
          <h1>{event?.title}</h1>
          <p className="text-muted ps-2">{formatDate(event?.date)}</p>
          <div className="card shadow-lg mb-5 rounded-4 w-100">
            <div className="card-body p-5">
              <h2 className="text-center fw-bold mb-4">Registration Form</h2>
              <div className="d-flex justify-content-around">
                <p>
                  <i className="bi bi-tags"></i> <strong>Event Type:</strong>{" "}
                  {event.event_type}
                </p>
                <p>
                  <i className="bi bi-person-lines-fill"></i>{" "}
                  <strong>Registration Type:</strong> {event.registration_type}
                </p>
              </div>

              {event.registration_type === "individual" ? (
                <>
                  <form
                    ref={formRef}
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="col-md-6">
                      <label
                        htmlFor="last_name"
                        className="form-label"
                        title="Last Name"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        required
                        value={participantFormData.last_name || ""}
                        onChange={handleParticipantChange}
                      />
                      <div className="invalid-feedback">
                        Please enter your last name.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label
                        htmlFor="first_name"
                        className="form-label"
                        title="First Name"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        required
                        value={participantFormData.first_name || ""}
                        onChange={handleParticipantChange}
                      />
                      <div className="invalid-feedback">
                        Please enter your first name.
                      </div>
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="contact_number" className="form-label">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="contact_number"
                        name="contact_number"
                        required
                        value={participantFormData.contact_number || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            if (value.length <= 11) {
                              handleParticipantChange(e);
                            }
                          }
                        }}
                        maxLength={11}
                      />
                      <div className="invalid-feedback">
                        Please enter a valid contact number.
                      </div>
                    </div>

                    <div className="col-md-8">
                      <label
                        htmlFor="address"
                        className="form-label"
                        title="Address"
                      >
                        Address
                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "12px" }}
                        >
                          (House Block/Lot/Street/Barangay/Municipality)
                        </span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        required
                        value={participantFormData.address || ""}
                        onChange={handleParticipantChange}
                      />
                      <div className="invalid-feedback">
                        Please provide your complete address.
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        required
                        value={participantFormData.email || ""}
                        onChange={handleParticipantChange}
                      />
                      <div className="invalid-feedback">
                        Please enter a valid email address.
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          required
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                        />
                        <label className="form-check-label">
                          Agree to terms and conditions
                        </label>
                        <div className="invalid-feedback">
                          You must agree before submitting.
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-2"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <form
                    ref={formRef}
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <div className="col-md-12">
                      <label className="form-label">Team Name</label>
                      <input
                        type="text"
                        name="team_name"
                        className="form-control"
                        value={teamFormData.team_name || ""}
                        onChange={handleTeamChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Please enter your team name.
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <h5 className="mt-4">Team Captain (Leader)</h5>
                        <div className="col-md-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="leader_name"
                            value={teamFormData.leader_name || ""}
                            onChange={handleTeamChange}
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">Age</label>
                          <input
                            type="number"
                            className="form-control"
                            name="leader_age"
                            value={teamFormData.leader_age || ""}
                            onChange={handleTeamChange}
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Contact</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="leader_contact"
                            value={teamFormData.leader_contact || ""}
                            onChange={handleTeamChange}
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="leader_email"
                            value={teamFormData.leader_email || ""}
                            onChange={handleTeamChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <h5 className="mt-4">Team Members</h5>
                      {teamFormData.members.map((member, index) => (
                        <div key={index} className="mb-3 row">
                          <div className="col-md-3">
                            <label className="form-label">Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={member.name || ""}
                              onChange={(e) =>
                                handleMemberChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">Age</label>
                            <input
                              type="number"
                              className="form-control"
                              value={member.age || ""}
                              onChange={(e) =>
                                handleMemberChange(index, "age", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Contact</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={member.contact || ""}
                              onChange={(e) =>
                                handleMemberChange(
                                  index,
                                  "contact",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={member.email || ""}
                              onChange={(e) =>
                                handleMemberChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="container d-flex justify-content-around">
                      <div className="d-flex">
                        <button
                          type="button"
                          className="btn btn-secondary mx-auto"
                          onClick={addMember}
                        >
                          Add Member
                        </button>
                      </div>

                      {teamFormData.members.length >= 1 && (
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn btn-danger mx-auto"
                            onClick={removeMember}
                          >
                            Remove Member
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          required
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                        />
                        <label className="form-check-label">
                          Agree to terms and conditions
                        </label>
                        <div className="invalid-feedback">
                          You must agree before submitting.
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-2"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          <button className="btn btn-outline-dark" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-1"></i> Go Back
          </button>
        </div>

        <div className="col-4 px-3">
          <div className="card shadow-lg mb-4">
            <div className="card-header text-center py-3">
              <h5 className="mb-1 fw-semibold text-uppercase">Event Details</h5>
              <p className="text-muted small m-0">
                Registration:{" "}
                {new Date(event.registration_start_date).toLocaleDateString()} -{" "}
                {new Date(event.registration_end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="card-body">
              <div className="px-2">
                <p>
                  <i className="bi bi-calendar-event"></i>{" "}
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <i className="bi bi-clock"></i> <strong>Time:</strong>{" "}
                  {event.time}
                </p>
                <p>
                  <i className="bi bi-geo-alt"></i> <strong>Location:</strong>{" "}
                  {event.location}
                </p>
                <p>
                  <i className="bi bi-person-workspace"></i>{" "}
                  <strong>Organizer:</strong> {event.event_organizer}
                </p>
                <p>
                  <i className="bi bi-people"></i>{" "}
                  <strong>Max Participants:</strong>{" "}
                  {event.number_of_participants}
                </p>
                <p>
                  <i className="bi bi-telephone"></i> <strong>Contact:</strong>{" "}
                  {event.contact_number}
                </p>
                <p>
                  <i className="bi bi-tags"></i> <strong>Type:</strong>{" "}
                  {event.event_type} ({event.registration_type})
                </p>
              </div>

              {event.requirements && (
                <div className="mt-4">
                  <h6>
                    <i className="bi bi-list-check"></i>{" "}
                    <strong>Requirements:</strong>
                  </h6>
                  <ul className="list-unstyled px-2">
                    {event.requirements.split("\n").map((req, index) => (
                      <li key={index} className="mb-1">
                        <i className="bi bi-check-lg text-success"></i> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!isEventRegistrationPageActive && (
                <Link
                  to={`/registration/${event.id}`}
                  className="btn btn-primary w-100"
                >
                  <i className="bi bi-pencil-square"></i> Register Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <ModalSuccessfulRegistration
        showModal={showModal}
        setShowModal={setShowModal}
        title="Registration Successful!"
        body="Thank you for registering for the event. We have received your details and will contact you if further information is needed. You can now view the event details or check your registered events."
        redirect="events"
      />
    </div>
  );
};

export default EventRegistration;

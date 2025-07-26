import React from "react";

function ModalMemberPreview({ member, id }) {
  if (!member) return null;

  return (
    <div id={id} className="modal fade" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div className="modal-content rounded-4 shadow-lg border border-primary">
          <div className="modal-header bg-primary text-white rounded-top-4 border-bottom border-light">
            <h5 className="modal-title fw-bold text-uppercase">
              Member Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body p-5">
            <h2 className="text-center fw-bold mb-4 text-primary">
              YOUTH PROFILING OF KATIPUNAN NG KABATAAN (KK)
            </h2>
            <p className="text-muted text-center mb-4">
              The Sangguniang Kabataan (SK) of Barangay Inocencio is gathering
              important demographic information to better serve the youth...
            </p>

            <div className="row g-4 border-top shadow-lg rounded-4 px-4 mt-3">
              <h4 className="text-center mb-4 text-primary fw-bold">A. Profile</h4>
              <div className="col-md-6">
                <label className="fw-semibold">Full Name:</label>
                <p>
                  {member.first_name} {member.middle_name} {member.last_name}{" "}
                  {member.suffix}
                </p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Sex:</label>
                <p>{member.sex}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Age:</label>
                <p>{member.age}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Age Group:</label>
                <p>{member.age_group}</p>
              </div>
              <div className="col-md-12">
                <label className="fw-semibold">Address:</label>
                <p>{member.address}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Area:</label>
                <p>{member.area}</p>
              </div>
            </div>

            <hr />

            <div className="row g-4 border-top shadow-lg rounded-4 px-4 mt-3">
              <h4 className="text-center mb-4 text-primary fw-bold">
                B. Demographic Characteristics
              </h4>
              <div className="col-md-6">
                <label className="fw-semibold">Civil Status:</label>
                <p>{member.civil_status}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Contact Number:</label>
                <p>{member.contact_number}</p>
              </div>
              <div className="col-md-12">
                <label className="fw-semibold">Email:</label>
                <p>{member.masked_email}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Education:</label>
                <p>{member.education}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Employment:</label>
                <p>{member.employment}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">National Voter:</label>
                <p>{member.national_voter}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">SK Voter:</label>
                <p>{member.sk_voter}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Election Vote:</label>
                <p>{member.election_vote}</p>
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Attended KK Assembly:</label>
                <p>{member.kk_assembly}</p>
              </div>
              {member.kk_assembly === "No" && (
                <div className="col-md-12">
                  <label className="fw-semibold">
                    Reason for not attending KK Assembly:
                  </label>
                  <p>{member.kk_reason}</p>
                </div>
              )}
            </div>

            <hr />

            <div className="row g-4 border-top shadow-lg rounded-4 px-4 mt-3">
            <h4 className="text-center mb-4 text-primary fw-bold">C. Others</h4>
              <div className="col-md-12">
                <label className="fw-semibold">Youth Concerns:</label>
                <p>{member.youth_concerns}</p>
              </div>
              <div className="col-md-12">
                <label className="fw-semibold">Recommendations:</label>
                <p>{member.recommendations}</p>
              </div>
              <div className="col-md-12">
                <label className="fw-semibold">Project Recommendations:</label>
                <p>{member.project_recommendations}</p>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top border-light">
            <button
              type="button"
              className="btn btn-outline-primary fw-semibold"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalMemberPreview;

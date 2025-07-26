import React from "react";

function ModalConfirmPublish({ id, onConfirm }) {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              Confirm Publish
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p>Are you sure you want to publish this event now?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              className="btn text-light btn-success"
              onClick={onConfirm}
              data-bs-dismiss="modal"
            >
              Yes, Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmPublish;

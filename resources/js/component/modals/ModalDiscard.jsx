import React from "react";

function ModalDiscard({ id, onConfirm }) {
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
              Discard Changes?
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to discard all changes? This action cannot
              be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              className="btn btn-danger"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDiscard;

import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ModalSuccessfulRegistration = ({
  showModal,
  setShowModal,
  title = "Notification!",
  body = "Alert",
  redirect
}) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const bsModal = useRef(null);

  useEffect(() => {
    if (modalRef.current && !bsModal.current) {
      bsModal.current = new Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });

      const handleHidden = () => {
        setShowModal(false);
        navigate(`/${redirect}`);
      };

      modalRef.current.addEventListener("hidden.bs.modal", handleHidden);

      return () => {
        modalRef.current?.removeEventListener("hidden.bs.modal", handleHidden);
      };
    }
  }, [navigate, setShowModal]);

  useEffect(() => {
    if (showModal && bsModal.current) {
      bsModal.current.show();
    } else if (!showModal && bsModal.current) {
      bsModal.current.hide();
    }
  }, [showModal]);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex="-1"
      aria-hidden={!showModal}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            <p>{body}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSuccessfulRegistration;

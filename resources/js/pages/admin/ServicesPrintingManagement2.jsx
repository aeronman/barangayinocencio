import React, { useState, useEffect } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import PrinterScheduleTable from "../../component/tables/PrintingScheduleTable";
import PrintingScheduleCalendar from "../../component/AdminPrintingScheduleCalendar2";
import axios from "axios";
import { useAPI } from "../../component/contexts/ApiContext";
import { useNavigate } from "react-router-dom";

const CollectedBottleCard = ({ icon, count, label }) => (
  <div className="col-12 col-md-6">
    <div className="card text-center bg-primary bg-gradient text-white rounded-4 h-100">
      <div className="card-body">
        <div className="mb-3">
          <i className={`bi ${icon} fs-1`} aria-hidden="true"></i>
        </div>
        <h1 className="fw-bold display-1">{count}</h1>
        <p className="mb-0 fw-semibold">{label}</p>
      </div>
    </div>
  </div>
);

function ServicesPrintingManagement() {
  const { getData } = useAPI();
  const [showModal, setShowModal] = useState(false);
  const [collectedBottles, setCollectedBottles] = useState({
    plastic_count: 0,
    glass_count: 0,
  });
  const [form, setForm] = useState({
    plastic: 0,
    glass: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData("/collected-bottles");
        setCollectedBottles(response);
        setForm({
          plastic: response?.plastic_count,
          glass: response?.glass_count,
        });
      } catch (error) {
        console.error("Failed to fetch collected bottles:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("/api/collected-bottles", {
        plastic_count: form.plastic,
        glass_count: form.glass,
      })
      .then(() => {
        setCollectedBottles({
          plastic_count: form.plastic,
          glass_count: form.glass,
        });
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating bottles:", error);
      });
  };

  return (
    <>
      <Breadcrumb />
      <PrintingScheduleCalendar />

      <div className="mt-5 container text-center">
        <button
          onClick={() => {
            navigate("weekly-report");
          }}
          className="btn btn-lg fs-3 btn-primary"
        >
          Weekly Report
        </button>
      </div>

      <div className="py-5">
        <h2 className="text-center fw-bold mb-4">TOTAL COLLECTED BOTTLES</h2>

        <div className="row justify-content-center g-4">
          <CollectedBottleCard
            icon="bi-cup"
            count={collectedBottles.plastic_count}
            label="Plastic"
          />
          <CollectedBottleCard
            icon="bi-box"
            count={collectedBottles.glass_count}
            label="Glass"
          />
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleOpenModal}
            className="btn btn-outline-primary px-4 rounded-pill btn-lg"
          >
            Update
          </button>
        </div>
      </div>

      <PrinterScheduleTable
        title="Pending Printing Schedule"
        hasActions={true}
      />

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Update Collected Bottles</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Plastic Bottles</label>
                    <input
                      type="number"
                      name="plastic"
                      className="form-control"
                      value={form.plastic}
                      onChange={handleChange}
                      min={0}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Glass Bottles</label>
                    <input
                      type="number"
                      name="glass"
                      className="form-control"
                      value={form.glass}
                      onChange={handleChange}
                      min={0}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ServicesPrintingManagement;

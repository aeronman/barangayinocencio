import React, { useEffect, useState } from "react";
import "./../../css/dashboard_widget.css";
import { useAPI } from "./contexts/ApiContext";

function AdminDashboardWidget() {
  const { getData, postData, putData, deleteData } = useAPI();
  const [membersData, setMembersData] = useState("");
  const [eventsData, setEventsData] = useState("");
  const [collectedBottles, setCollectedBottles] = useState("");
  const [printsData, setPrintsData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    getData("members", setMembersData, setLoading, setError);
  }, [getData]);

  useEffect(() => {
    getData("events", setEventsData, setLoading, setError);
  }, [getData]);

  useEffect(() => {
    getData(
      "/collected-bottles",
      (response) => {
        const plastic = response?.plastic_count || 0;
        const glass = response?.glass_count || 0;
        setCollectedBottles(plastic + glass);
      },
      setLoading,
      setError
    );
  }, [getData]);

  useEffect(() => {
    const fetchAllReservationDates = async () => {
      await getData("printing-services", (data) => {
        const dates = data.map((r) =>
          new Date(r.reservation_date).toLocaleDateString("en-CA")
        );
        setPrintsData(dates);
        console.log(dates);
      });
    };

    fetchAllReservationDates();
  }, [getData]);

  return (
    <div className="row g-4 mt-3 mb-5">
      <div className="col-md-6 col-lg-3">
        <div className="card dashboard-card shadow-lg">
          <div className="card-body text-center">
            <div className="icon-container">
              <i className="bi bi-people-fill"></i>
            </div>
            <h4 className="fw-bold">{membersData?.length || 0}</h4>
            <p className="card-text fs-5">KK Members</p>
          </div>
          <div className="card-footer text-center bg-warning text-white rounded-bottom-4">
            <strong>Total Members</strong>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-3">
        <div className="card dashboard-card shadow-lg">
          <div className="card-body text-center">
            <div className="icon-container">
              <i className="bi bi-calendar-event-fill"></i>
            </div>
            <h4 className="fw-bold">{eventsData?.length || 0}</h4>
            <p className="card-text fs-5">Ongoing Events</p>
          </div>
          <div className="card-footer text-center bg-success text-white rounded-bottom-4">
            <strong>Events In Progress</strong>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-3">
        <div className="card dashboard-card shadow-lg">
          <div className="card-body text-center">
            <div className="icon-container">
              <i className="bi bi-recycle"></i>
            </div>
            <h4 className="fw-bold">
              {collectedBottles || 0}
              <span className="fs-5"> kg</span>
            </h4>
            <p className="card-text fs-5">Collected Bottles</p>
          </div>
          <div className="card-footer text-center bg-info text-white rounded-bottom-4">
            <strong>Total Collected</strong>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-3">
        <div className="card dashboard-card shadow-lg">
          <div className="card-body text-center">
            <div className="icon-container">
              <i className="bi bi-file-text-fill"></i>
            </div>
            <h4 className="fw-bold">{printsData?.length || 0}</h4>
            <p className="card-text fs-5">Pending Prints</p>
          </div>
          <div className="card-footer text-center bg-danger text-white rounded-bottom-4">
            <strong>Prints Pending</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardWidget;

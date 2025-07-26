import React, { useState, useEffect } from "react";
import { useAPI } from "../../component/contexts/ApiContext";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import ComputerRentCalendar from "../../component/ComputerRentCalendar";

function ComputerServices() {
   return (
    <>
      <div className="container mt-5 pb-5" id="calendar-section">
        <ComputerRentCalendar />
      </div>
    </>
  );
}

export default ComputerServices;

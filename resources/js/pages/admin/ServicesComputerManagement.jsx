import React, { useEffect, useState } from "react";
import Breadcrumb from "../../component/ui/Breadcrumb";
import AdminComputerRentCalendar from "../../component/AdminComputerRentCalendar";

function ServicesComputerManagement() {
  return (
    <>
      <Breadcrumb />
      <AdminComputerRentCalendar />
    </>
  );
}

export default ServicesComputerManagement;

import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
import { useState, useEffect } from "react";
import ComputerRentCalendar from "../component/ComputerRentCalendar";
import { useAPI } from "../component/contexts/ApiContext";
import Carousel from "../component/Caroucel";
import { Outlet } from "react-router-dom";

function ServicesLayout() {
  const { getData } = useAPI();
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData("carousel?page=home", setCarouselItems, setLoading, setError);
  }, [getData]);

  return (
    <>
      <Carousel carouselItems={carouselItems} />
      <Outlet />
    </>
  );
}

export default ServicesLayout;

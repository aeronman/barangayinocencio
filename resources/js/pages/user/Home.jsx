import React, { useEffect, useState } from "react";
import Carousel from "../../component/Caroucel";
import News from "./News";
import Announcements from "./Announcements";
import Events from "./Events";
import { useAPI } from "../../component/contexts/ApiContext";

function Home() {
  const { getData } = useAPI();
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    getData("carousel?page=home", setCarouselItems, setLoading, setError);
    getData("settings", setSettings, setLoading, setError);
  }, [getData]);

  if (loading) return null;

  return (
    <>
      <Carousel carouselItems={carouselItems} />
      <News isFullPage={false} />
      <Announcements isFullPage={false} />
      <Events isFullPage={false} />

      <div className="container pb-5">
        <div className="container text-center my-5">
          <h5 className="section-title text-primary">Our Purpose</h5>
          <h2 className="main-heading mt-3 text-dark">Mission & Vision</h2>
          <p className="sub-text mt-3">
            Discover the guiding principles behind the Batang Inocencio Youth
            Organization's work in the community. Our mission and vision focus
            on empowering youth and creating a positive impact.
          </p>
        </div>

        <div className="row m-0 text-center d-flex align-items-stretch">
          <div className="col-lg-6 col-md-12">
            <div className="border-top shadow-lg rounded-4 d-flex flex-column p-4 bg-gradient h-100">
              <div className="fs-2 fw-bold text-primary mb-3">Mission</div>
              <p className="fs-5 my-auto fst-italic text-muted">
                {settings?.mission}
              </p>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="border-top shadow-lg rounded-4 d-flex flex-column p-4 bg-gradient h-100">
              <div className="fs-2 fw-bold text-primary mb-3">Vision</div>
              <p className="fs-5 my-auto fst-italic text-muted">
                {settings?.vision}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

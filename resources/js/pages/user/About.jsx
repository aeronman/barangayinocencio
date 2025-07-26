import React, { useEffect, useState } from "react";
import { useAPI } from "../../component/contexts/ApiContext";
import Carousel from "../../component/Caroucel";

function About() {
  const { getData } = useAPI();
  const [carouselItems, setCarouselItems] = useState([]);
  const [orgMembers, setOrgMembers] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData("carousel?page=home", setCarouselItems, setLoading, setError);
    getData("committee", setOrgMembers, setLoading, setError);
    getData("settings", setSettings, setLoading, setError);
  }, [getData]);

  return (
    <>
      <Carousel carouselItems={carouselItems} />

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

      <div className="container py-5">
        <div className="fs-1 fw-bold text-center mb-5">
          Organizational Chart
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-lg-4 col-md-6 text-center mb-4">
            <div
              className="card shadow-lg rounded-4 p-3 border h-100 text-light"
              style={{
                background:
                  "linear-gradient(to top, rgba(var(--bs-info-rgb)), rgba(0,0,0,0))",
              }}
            >
              <div className="card-body">
                <img
                  src={
                    settings.chairperson_image && (settings.chairperson_image.startsWith("http") ||
                    settings.chairperson_image.startsWith("blob:")
                      ? settings.chairperson_image
                      : `/storage/${settings.chairperson_image}`)
                  }
                  className="img-fluid rounded-circle mb-3 border-5 border border-light"
                  style={{
                    width: "150px",
                    height: "200px",
                    objectFit: "contain",
                  }}
                  alt={settings.name}
                />
                <h4 className="fw-semibold">{settings.chairperson_name}</h4>
                <p className="text-muted mb-0">{settings.chairperson_position}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center g-5">
          {orgMembers
            .map((member, index) => (
              <div
                key={`other-${index}`}
                className="col-lg-4 col-md-6 text-center mb-4"
              >
                <div
                  className="card shadow-lg rounded-4 p-3 border h-100 text-light"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(var(--bs-success-rgb)), rgba(0,0,0,0))",
                  }}
                >
                  <div className="card-body">
                    <img
                      src={
                        member.image && (member.image.startsWith("http") ||
                        member.image.startsWith("blob:")
                          ? member.image
                          : `/storage/${member.image}`)
                      }
                      className="img-fluid rounded-circle mb-3 border-5 border border-light"
                      style={{
                        width: "130px",
                        height: "160px",
                        objectFit: "contain",
                      }}
                      alt={member.name}
                    />
                    <h4 className="fw-semibold">{member.name}</h4>
                    <p className="text-muted mb-0">{member.position}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default About;

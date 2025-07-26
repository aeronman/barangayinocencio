import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAPI } from "../../component/contexts/ApiContext";
import Carousel from "../../component/Caroucel";

function MembershipPage() {
  const { getData } = useAPI();
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData("carousel?page=membership", setCarouselItems, setLoading, setError);
  }, [getData]);

  return (
    <>
      <Carousel carouselItems={carouselItems} />
      <div className="text-bg-primary text-center py-3 fs-4 fw-semibold mb-5">
        KUNG KAYO AY 15-20 TAONG GULANG AT RESIDENTE NG BARANGAY INOCENCIO
        MAKIISA SA ISINAGAWANG YOUTH PROFILING
      </div>

      <div className="text-center">
        <Link
          to="/membership/registration"
          className="btn text-light rounded-pill btn-success btn-lg px-5 py-2 fw-bold my-3 fs-1 my-5"
        >
          REGISTER NOW
        </Link>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-7 d-flex flex-column justify-content-center">
            <h1 className="fw-bold text-success">
              ANO NGA BA ANG YOUTH PROFILING?
            </h1>
            <p className="fs-5">
              Ang YOUTH PROFILING ay isang mahalagang hakbang upang malaman ang
              kalagayan, datos, posisyon, ng mga miyembro ng Katipunan ng
              Kabataan na nasa 15-30 taong gulanga alinsunod sa SK Reform Act of
              2015 o RA 10742.
            </p>

            <p className="fs-5">
              Kayo ay makakaasa na ang baawat impormasyon na makakalap ay
              mananatiling pribado at nasa pangangasiwa lamang ng Sangguniang
              Kabataan ng Barangay Inocencio, Trece Martires City, Cavite.{" "}
            </p>
          </div>
          <div className="col-5">
            <img
              src="/images/illustration2.png"
              className="img-fluid w-100 h-100 object-fit-fill"
              alt="Illustration Image"
            />
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-5">
            <img
              src="/images/illustration1.png"
              className="img-fluid w-100 h-100 object-fit-fill"
              alt="Illustration Image"
            />
          </div>

          <div className="col-7 d-flex flex-column justify-content-center">
            <h1 className="fw-bold text-success">
              BAKIT MAYROONG YOUTH PROFILING?
            </h1>
            <p className="fs-5">
              Ito ang gagamitin sa paggawa ng mga plano at paghingi ng mga
              suhestyon para sa programa na naglalayong mapabuti ang kalagayan
              ng mga Batang Inocencio at buong Barangay.
            </p>

            <p className="fs-5">
              Ito rin ay makakatulong na makilala ang mga miyembro ng Kabataan
              ng Katipunan at magkaoon ng mabilis at maayos na komunikasyon at
              transaksyon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MembershipPage;

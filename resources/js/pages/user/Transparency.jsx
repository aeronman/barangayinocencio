import React, { useEffect, useState } from "react";
import { useAPI } from "../../component/contexts/ApiContext";
import Carousel from "../../component/Caroucel";

function Transparency() {
  const { getData } = useAPI();
  const [carouselItems, setCarouselItems] = useState([]);
  const [transparenciesItems, setTransparencyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData("carousel?page=transparency", setCarouselItems, setLoading, setError);
  }, [getData]);

  useEffect(() => {
    getData("transparencies", setTransparencyItems, setLoading, setError);
  }, [getData]);

  return (
    <>
      <Carousel carouselItems={carouselItems} />

      <div className="text-bg-primary text-center py-3 fs-4 fw-semibold mb-5">
        2nd Floor, City Hall Bldg., Governor’s Drive, Brgy. Inocencio, Trece Martires City, Cavite
      </div>

      <div className="container">
        <div className="accordion" id="faqAccordion">
          {transparenciesItems.map((report, index) => {
            const collapseId = `collapse${index}`;
            const headingId = `heading${index}`;
            const isFirst = index === 0;

            return (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={headingId}>
                  <button
                    className={`accordion-button fw-semibold ${!isFirst ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded={isFirst ? "true" : "false"}
                    aria-controls={collapseId}
                  >
                    {report.category}
                  </button>
                </h2>
                <div
                  id={collapseId}
                  className={`accordion-collapse collapse ${isFirst ? "show" : ""}`}
                  aria-labelledby={headingId}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    {report.files.map((file, fileIndex) => (
                      <div key={fileIndex}>
                        <a href={`/storage/${file.file_url}`} target="_blank" rel="noopener noreferrer">
                          {file.file_name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Transparency;

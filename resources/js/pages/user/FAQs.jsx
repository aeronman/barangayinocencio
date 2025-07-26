import React, { useEffect, useState } from "react";
import { useAPI } from "../../component/contexts/ApiContext";
import Carousel from "../../component/Caroucel";

function FAQs() {
  const { getData } = useAPI();
  const [carouselItems, setCarouselItems] = useState([]);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    getData("carousel?page=faqs", setCarouselItems, setLoading, setError);
  }, [getData]);

  useEffect(() => {
    getData("faqs", setFaqItems, setLoading, setError);
  }, [getData]);

  return (
    <>
      <Carousel carouselItems={carouselItems} />

      <div className="container mt-5">
        <div className="accordion" id="faqAccordion">
          {faqItems.map((item, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className={`accordion-button fw-semibold ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={`collapse${index}`}
                >
                  <i className="bi bi-question"></i>
                  <span className="me-2">QUESTION:</span>
                  {item.question}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                aria-labelledby={`heading${index}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  <span className="me-2">ANSWER:</span>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FAQs;

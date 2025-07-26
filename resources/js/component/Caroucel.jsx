import React from "react";

function Carousel({ carouselItems }) {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/800x500?text=No+Image+Available";
    e.target.classList.add("img-thumbnail");
  };

  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade position-relative"
    >
      <div className="carousel-inner">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={
                item.image.startsWith("http") || item.image.startsWith("blob:")
                  ? item.image
                  : `/storage/${item.image}`
              }
              className="d-block w-100 object-fit-cover"
              style={{ height: "500px" }}
              onError={handleImageError}
              alt={item.title}
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-center h-100 text-white">
              <div className="display-1 fw-bold">{item.title}</div>
              <p className="fs-5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon p-4"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon p-4"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;

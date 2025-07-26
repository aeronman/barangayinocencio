
import Carousel from "../../component/Caroucel";
import ComputerRentCalendar from "../../component/ComputerRentCalendar";

function Services() {
  return (
    <>
      <Carousel carouselItems={carouselItems} />

      <div className="container mt-5 pb-5" id="calendar-section">
        <ComputerRentCalendar />
      </div>
    </>
  );
}

export default Services;

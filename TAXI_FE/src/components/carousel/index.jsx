import React from "react";
import { Carousel, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CustomCarousel() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleBookRide = () => {
    if (token && role === "STUDENT") {
      navigate("/create-ride");
    } else {
      toast.error("You must be logged in as a STUDENT to access this page.");
    }
  };

  const handleJoinRide = () => {
    if (token && role === "STUDENT") {
      navigate("/join-ride");
    } else {
      toast.error("You must be logged in as STUDENT to access this page.");
    }
  };

  return (
<div className="container-fluid p-0">
  <div className="custom-carousel">
    <Carousel fade>
      <Carousel.Item>
        <img className="d-block w-100" src="/busdrive.jpg" alt="First slide" />
        <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="p-3" style={{ maxWidth: 900 }}>
            <h5 className="text-white text-uppercase mb-2">Taxi Online Service</h5>
            <h1 className="display-1 text-white mb-md-4" style={{ fontSize: "calc(1.5rem + 2vw)", fontWeight: 'bold', whiteSpace: 'nowrap' }}>Amazing Journey With Share Ride</h1>
            <Button
              onClick={handleBookRide}
              variant="primary"
              className="py-md-2 px-md-2 me-3"
            >
              Book a Ride
            </Button>
            <Button
              onClick={handleJoinRide}
              variant="secondary"
              className="py-md-2 px-md-2"
            >
              Join Ride
            </Button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100" src="/busdrive2.jpg" alt="Second slide" />
        <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="p-3" style={{ maxWidth: 900 }}>
            <h5 className="text-white text-uppercase mb-3">Taxi Online Service</h5>
            <h1 className="display-1 text-white mb-md-4" style={{ fontSize: "calc(1.5rem + 2vw)", fontWeight: 'bold', whiteSpace: 'nowrap' }}>Made for Students by Students</h1>
            <Button
              onClick={handleBookRide}
              variant="primary"
              className="py-md-2 px-md-2 me-3"
            >
              Book a Ride
            </Button>
            <Button
              onClick={handleJoinRide}
              variant="secondary"
              className="py-md-2 px-md-2"
            >
              Join Ride
            </Button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </div>
</div>

  );
}

export default CustomCarousel;

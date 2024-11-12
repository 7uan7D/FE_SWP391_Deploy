import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../../config/axiox";
import "./index.css";

function ComplaintCarousel() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchComplaints = async () => {
    try {
      const response = await api.get("/complaints/getAll");
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <div className="complaints-carousel">
          {complaints.length > 0 ? (
            <Slider {...sliderSettings} key={complaints.length}>
              {complaints.map((complaint, index) => (
                <div
                  key={index}
                  className="complaint-item p-4 bg-white rounded-lg shadow-md flex flex-col justify-between"
                  style={{ margin: '0 10px' }}
                >
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-800">
                      {complaint.fullName}
                    </p>
                    <p className="text-gray-600">{`Feedback: ${complaint.description}`}</p>
                    <p className="text-sm text-gray-500">{`Date: ${formatDate(complaint.submittedDate)}`}</p>
                  </div>
                  <p className="rating flex items-center">
                    {`Rating: `}
                    {[...Array(complaint.rating)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        style={{ color: "#ffc107", marginLeft: "4px" }}
                      />
                    ))}
                  </p>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500">Loading complaints...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComplaintCarousel;

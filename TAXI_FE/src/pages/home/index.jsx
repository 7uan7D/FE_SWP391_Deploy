import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import api from "../../config/axiox";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { toast } from "react-toastify";
import CustomCarousel from "../../components/carousel";
import ComplaintCarousel from "../../components/complaints-carousel";
import AboutUs from "../../aboutus";


function HomePage() {

  return (
    <>
    <CustomCarousel />
    <ComplaintCarousel />
    <AboutUs />
    </>
  );
}

export default HomePage;

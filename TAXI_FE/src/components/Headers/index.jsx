import { Layout } from "antd";
import React from "react";
import { toast } from "react-toastify";

function Header() {
  const { Header } = Layout;
  
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isStudent = token && role === "STUDENT";

  const handleChatClick = (e) => {
    if (!isStudent) {
      e.preventDefault();
      toast.error("You must be logged in as STUDENT to access this page.");
    }
  };

  return (
    <div className="container-fluid bg-light ps-5 pe-0 d-none d-lg-block">
      <div className="row gx-0">
        <div className="col-md-6 text-center text-lg-start mb-2 mb-lg-0">
          <div className="d-inline-flex align-items-center">
            <small className="py-2">
              <i className="far fa-clock text-primary me-2" />
              Opening Hours: Mon - Sat : 8.00 am - 7.00 pm
            </small>
          </div>
        </div>
        <div className="col-md-6 text-center text-lg-end">
          <div className="position-relative d-inline-flex align-items-center bg-primary text-white top-shape px-5">
            <div className="me-3 pe-3 border-end py-2">
              <p className="m-0">taxis@fpt.edu.vn</p>
            </div>
            <div className="py-2 text-center">
              <a href="/chat" className="m-0 text-white" onClick={handleChatClick}>Chat with Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
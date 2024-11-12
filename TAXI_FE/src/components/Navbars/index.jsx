import React, { useState } from "react";
import classnames from "classnames";
import { FaBars } from "react-icons/fa";
import {
  NavbarBrand,
  Navbar,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function IndexNavbar() {
  const [navbarCollapse, setNavbarCollapse] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const isStudent = token && role === "STUDENT";
  const isStaff = token && role === "STAFF";

  const toggleNavbarCollapse = () => {
    setNavbarCollapse(!navbarCollapse);
    document.documentElement.classList.toggle("nav-open");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setNavbarCollapse(false);
    setDropdownOpen(false);
    navigate("/");
  };

  const handleCreateRide = () => {
    if (isStudent) {
      navigate("/create-ride");
    } else {
      toast.error("You must be logged in as STUDENT to access this page.");
    }
  };

  const handleJoinRide = () => {
    if (isStudent) {
      navigate("/join-ride");
    } else {
      toast.error("You must be logged in as STUDENT to access this page.");
    }
  };

  const handleMyRides = () => {
    if (isStudent) {
      navigate("/my-rides");
    } else {
      toast.error("You must be logged in as STUDENT to access this page.");
    }
  };

  const handleModerateRide = () => {
    if (isStaff) {
      navigate("/moderate-ride");
    } else {
      toast.error("You must be logged in as STAFF to access this page.");
    }
  };

  const handleModerateFeedback = () => {
    if (isStaff) {
      navigate("/moderate-feedback");
    } else {
      toast.error("You must be logged in as STAFF to access this page.");
    }
  };

  const handleChat = () => {
    if (token && (isStudent || isStaff)) {
      navigate("/chat");
    } else {
      toast.error("You must be logged in as STUDENT or STAFF to access this page.");
    }
  };

  const handleConversation = () => {
    if (token && (isStudent || isStaff)) {
      navigate("/conversation");
    } else {
      toast.error("You must be logged in as STUDENT or STAFF to access this page.");
    }
  };

  return (
    <Navbar className={classnames("navbar")} expand="lg">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <NavbarBrand href="/" id="navbar-brand">
          <img src="/logo.png" alt="Taxis Logo" className="logo-img" />
        </NavbarBrand>

        <div className={`right-section ${isOpen ? "active" : ""}`}>
          {token ? (
            <>
              <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="nav-item">
                <DropdownToggle caret className="nav-link">
                  MENU
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => navigate('/profile')}>Profile</DropdownItem>
                  {isStudent && (
                    <>
                      <DropdownItem onClick={handleCreateRide}>Create Rides</DropdownItem>
                      <DropdownItem onClick={handleMyRides}>My Rides</DropdownItem>
                      <DropdownItem onClick={handleJoinRide}>Join Rides</DropdownItem>
                    </>
                  )}
                  {isStaff && (
                    <>
                      <DropdownItem onClick={handleModerateRide}>Moderate Ride</DropdownItem>
                      <DropdownItem onClick={handleModerateFeedback}>Moderate Feedback</DropdownItem>
                    </>
                  )}
                  <DropdownItem onClick={handleChat}>Chat</DropdownItem>
                  <DropdownItem onClick={handleConversation}>Conversation</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <button className="login-btn" onClick={handleLogout}>
                Log Out
              </button>
              <span className="welcome-message">Hello, {username || "User"}</span>
            </>
          ) : (
            <Link to="/login">
              <button className="login-btn">Log In</button>
            </Link>
          )}
        </div>

        <div className="icon" onClick={toggleMenu}>
          <FaBars />
        </div>
      </Container>
    </Navbar>
  );
}

export default IndexNavbar;

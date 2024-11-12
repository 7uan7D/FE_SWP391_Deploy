import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../Headers";
import NavbarComponent from "../Navbars";
import Footer from "../Footers";



function Layout() {
  return (
    <>
      <Header />
      <NavbarComponent />
      

      
        <Outlet />
      
      <Footer />
    </>
  );
}

export default Layout;

import React from "react";
import Navbar from "./components/Navbars";
import Footer from "./components/Footers";
import Header from "./components/Headers";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Navbar />
      <main>{children}<Outlet /></main>
      <Footer />
    </div>
  );
};

export default Layout;
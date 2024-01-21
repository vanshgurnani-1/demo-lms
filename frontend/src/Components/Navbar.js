import React from "react";
import "../Components/Navbar.css";
import logo from "../Police_logo.png";

const Navbar = () => {
  return (
    <div id="navbar_container">
      <img src={logo} className="h-full" />
      <div>hi</div>
      <h2>Library Management Systemms</h2>
      <button>Logout</button>
    </div>
  );
};

export default Navbar;

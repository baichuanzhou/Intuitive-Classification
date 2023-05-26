import React from "react";
import "../../utilities.css";
import "./NavBar.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */

const NavBar = () => {
  return (
    <>
      <nav className="NavBar-container">
        <div className="NavBar-title">Toy Classification PlayGround</div>
      </nav>
    </>
  )
}

export default NavBar;


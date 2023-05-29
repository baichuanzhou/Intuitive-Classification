import React from "react";
import "../../utilities.css";
import "./NavBar.css";
import { ReactComponent as ReactLogo } from "../../logo/github-mark-white.svg";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */

const NavBar = () => {
  return (
    <>
      <nav className="NavBar-container">
        <div className="NavBar-title">
          Intuitive Classification
          <div className={"github-logo"}>
            <a href={"https://github.com/baichuanzhou/Intuitive-Classification"} title={"Source on GitHub"}>
              <ReactLogo />
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavBar;


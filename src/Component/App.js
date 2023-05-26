import React from "react";
import NavBar from "./modules/NavBar.js";
import DataSets from "./modules/Data.js";
import "../utilities.css";
import "./App.css";
import ControlPanel from "./modules/ControlPanel.js";
import Control from "./Control.js";

const App = () => {

  return (
    <>
      <NavBar />
      <div className="ui-Control">
        <Control />
      </div>
    </>
  )
}

export default App;
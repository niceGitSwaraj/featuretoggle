import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/nicelogo.PNG";

function Navigation() {
  
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">  
            <img id="logo" src={logo} alt="logo"></img>           
            Feature Toggle Tool
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Dashboard
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/XmlToXml">
                  XmlToXml
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/XmlToConfigMgr">
                  XmlToConfig
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/ConfigMgrToConfigMgr">
                  ConfigToConfig
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;

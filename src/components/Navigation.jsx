import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/nicelogo.PNG";

function Navigation(props) {

  const homeDashNavLink = "/Home?code="+props.funcCode;
  const xmlNavLink = "/XmlToXml?code="+props.funcCode;
  const xmlConfigNavLink = "/XmlToConfigMgr?code="+props.funcCode;
  const cgfcfgNavLink = "/ConfigMgrToConfigMgr?code="+props.funcCode;
  
  function resetLoginParams(){
    localStorage.clear();
  }
  console.log(xmlNavLink);
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
                <NavLink className="nav-link" to={homeDashNavLink}>
                  Dashboard
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={xmlNavLink}>
                  XmlToXml
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={xmlConfigNavLink}>
                  XmlToConfig
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={cgfcfgNavLink}>
                  ConfigToConfig
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-info" to="/Login" onClick={resetLoginParams}>
                  Logout
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

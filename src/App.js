import React, { useState, Fragment, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Navigation,XmlToXml,XmlToConfigMgr,ConfigMgrToConfigMgr,Home} from "./components/index";
import axios from 'axios';


const App = () => {  
  return (
    
    <div className="app-container"> 
    <Router>
    <Navigation /> 
      <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/XmlToXml" element={<XmlToXml />} />
          <Route path="/XmlToConfigMgr" element={<XmlToConfigMgr />} />
          <Route path="/ConfigMgrToConfigMgr" element={<ConfigMgrToConfigMgr />} />      
          <Route path="/Home" element={<Home />} />
          
        </Routes>    
    </Router>

    </div>
  );
};

export default App;

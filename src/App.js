import React, { useState, Fragment, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Navigation,XmlToXml,XmlToConfigMgr,ConfigMgrToConfigMgr,Home,Login,SecretsManager} from "./components/index";
import axios from 'axios';
import { ClientSideRowModelSteps } from "ag-grid-community";
//import Login from "./components/Login";
import { useLocation } from 'react-router-dom'
//import { SecretsManagerClient, GetSecretValueCommand, } from "@aws-sdk/client-secrets-manager";
//pass the codeparams from page to page....



const App = () => {  
  
  //const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
 // const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  //const bearerToken = process.env.REACT_APP_BEARER_TOKEN;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let codeParams = urlParams.get("code");
  const [rerender,setRerender] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [user,setUser] = useState("");
  //localStorage.setItem("kickedBack",false);
  //const location = useLocation(); 
  //console.log(bearerToken); 
  //console.log(CLIENT_ID);
  //console.log(CLIENT_SECRET);
  //console.log(bearerToken);
  
  useEffect(() => {
    
    if(codeParams && localStorage.getItem("access_token") === null){
      async function getAccessToken(){
        console.log("here codeParams: "+codeParams);        
        await fetch("http://localhost:4000/getAccessToken?code="+codeParams,{
          method: "GET"
        }).then((response) => {
            return response.json();
        }).then((data) => {
          console.log(data);
          if(data.access_token){
            localStorage.setItem("access_token",data.access_token);
            setRerender(!rerender);
          }
        })
      }
      getAccessToken();
    }    
  },[]);

  async function getUserData(){
    //console.log(localStorage.getItem("access_token"))
    await fetch ("http://localhost:4000/getUserData",{
      method: "GET",
      headers: {
        "Authorization" : "Bearer "+localStorage.getItem("access_token")
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      localStorage.setItem("user", data.login);
      //console.log(data);      
    })       
 }
 if(localStorage.getItem("access_token") && !localStorage.getItem("user")){
      getUserData();
 }
 
  return (

    <div className="app-container"> 
    
    <Router>
    {   showNav &&
          <nav>
            <Navigation funcCode={localStorage.getItem("access_token")}/> 
          </nav>
    } 
    
      <Routes>
        
          <Route path="/" element={<Login funcNav={setShowNav}/>} />
          <Route path="/Login" element={<Login funcNav={setShowNav}/>} />
          <Route path="/XmlToXml" element={<XmlToXml funcUser={user}/>} />
          <Route path="/XmlToConfigMgr" element={<XmlToConfigMgr funcUser={user}/>} />
          <Route path="/ConfigMgrToConfigMgr" element={<ConfigMgrToConfigMgr funcUser={user}/>} />      
          <Route path="/Home" element={<Home />} />
          
        </Routes>    
    </Router>

    </div>

  );
};

export default App;

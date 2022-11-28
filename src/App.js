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
  
  const CLIENT_ID = "935f571cf46ad93a75b4"
  const CLIENT_SECRET = "b8529168a351aad84adaebd82ff4da61b635d8e8"
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let codeParams = urlParams.get("code");
  const [rerender,setRerender] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [user,setUser] = useState("");
  //localStorage.setItem("kickedBack",false);
  //const location = useLocation();
  console.log("dasd??");
  const bearerToken = process.env.REACT_APP_BEARER_TOKEN;
  //console.log(bearerToken);
  
  useEffect(() => {
   
      async function getAccessToken(){    
            const params = "https://github.com/login/oauth/access_token?client_id=" + 
            CLIENT_ID + "&client_secret=" + CLIENT_SECRET +"&code=" + codeParams;
            const settings = {
              method: 'POST',       
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',          
              }
            }    
            const response = await fetch(params, settings);
            if (!response.ok) throw Error(response.message);
          
            try {
              const data = await response.json();
              console.log(data);
              return data;
            } catch (err) {
              throw err;
            }
      };
    //  console.log( window.location.pathname);      
      async function getUser(accessToken){   
            const usersEndpoint = "https://api.github.com/user";
            const settings = {
              method: 'GET',       
              headers: {
                "Authorization" : "Bearer "+accessToken
              }
            }    
            const response = await fetch(usersEndpoint, settings);
            if (!response.ok) {
              window.location.assign("http://localhost:3000/Login")
            }
          
            try {
              const data = await response.json();
              return data;
            } catch (err) {
              throw err;
            }
      };

      async function getToken(){
        const token = await getAccessToken();                       
          if(token.access_token){
            localStorage.setItem("access_token",token.access_token);
            setRerender(!rerender);
          }         
          return localStorage.getItem("access_token");
      }

      async function getUserData(){
        let token = await getToken();
        const loggedInUser = await getUser(token);
        if(!loggedInUser.login){
          window.location.assign("http://localhost:3000/Login")
        }
        console.log(loggedInUser.login); 
        localStorage.setItem("user",loggedInUser.login);            
        setUser(loggedInUser.login);
      }
      if(codeParams && localStorage.getItem("access_token") === null){
        console.log("ok?");     
        getUserData();
      } 

  },[]);

 
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

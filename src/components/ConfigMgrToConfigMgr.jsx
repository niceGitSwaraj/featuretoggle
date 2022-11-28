import React from "react";

function ConfigMgrToConfigMgr(props) {
  /*if(!props.funcUser){
    console.log(props.funcUser);
    window.location.assign("http://localhost:3000/Login")
  }*/
  if(!localStorage.getItem("user")){
    console.log(localStorage.getItem("user"));
    window.location.assign("http://localhost:3000/Login")
  }
  return (
    <div className="contact">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-7">
            
          </div>
          <div class="col-lg-5">
            <h1 class="font-weight-light">ConfigManager-To-ConfigManager Comparison</h1>
            <p>
            Build in progress....    
            This page will show a comparison of all xmls from all envs of a particular feature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigMgrToConfigMgr;
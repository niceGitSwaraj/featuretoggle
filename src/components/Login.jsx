import React from "react";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;//this might have been revoked.....
function loginWithGitHub(){    
    return window.location.assign("https://github.com/login/oauth/authorize?client_id="+CLIENT_ID);
}
  
const Login = (props) => {
    props.funcNav(false);
    return (
        <>
        <center>
        <h1 class="display-3">Welcome to Feature Toggle Management Tool</h1>
         <button id="loginBtn" tyep="button" class="btn btn-info" onClick={loginWithGitHub}>
            Login With GitHub
         </button>
         </center>
         </>
        
    );
};

export default Login;
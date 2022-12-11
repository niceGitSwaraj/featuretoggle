var express = require('express')
var cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
var libxmljs = require("libxmljs");
const { response } = require('express');
const axios = require('axios');
const fetch = (...args) => import ('node-fetch').then(({default: fetch}) => fetch(...args));
var convert = require('xml-js');
//const parser = new DOMParser();

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const BEARER_TOKEN = process.env.REACT_APP_BEARER_TOKEN;

console.log(CLIENT_ID);
console.log(CLIENT_SECRET);
var app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/hello',async function(req,res){
    console.log("hello");
    res.send("hello");    
});

app.get('/getAccessToken',async function(req,res){   
    //console.log(req);
    const params = "?client_id="+CLIENT_ID+"&client_secret="+ CLIENT_SECRET +"&code="+req.query.code;
    await fetch("https://github.com/login/oauth/access_token"+params,{
        method: "POST",
        headers:{
            "Accept": "application/json"
        }
    }).then((response) => {        
        return response.json();
    }).then((data)=> {        
        res.json(data);
    });
});

app.get('/getUserData', async function (req,res){
    //console.log(req);
    req.get("Authorization");
    await fetch("https://api.github.com/user",{
        method: "GET",
        headers: {
            "Authorization" : req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data)=>{
        //console.log(data);
        res.json(data)
    })
})

app.get('/getBearerToken',function(req,res){   
 //console.log(BEARER_TOKEN);
 return res.json(BEARER_TOKEN);
});

app.get('/getXmlData',async function(req,res){
  // let params = req.query.envs.split(",");
   console.log(req.query.envs);
   let promises = [];
   let responseData = [];
  // for(var i=0;i<params.length;i++){
     //   console.log("--->"+params[i]);
            promises.push(
                axios.get(
                "https://raw.githubusercontent.com/nice-cxone/"+req.query.envs+"/master/toggles.xml",
                {
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        "content-type": "text/plain",
                        "Authorization": "Bearer "+BEARER_TOKEN,//+accessToken
                        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
                        }   
                }
                )
            )
   // }
     // console.log("umm?");
     // console.log(data);      
      Promise.all(promises).then((response) => {  
        jsonDataMaster = [];//this is very inefficient. try to append new array by checking previous key so reinsertion doesnt happen.
        for(let j=0;j<response.length;j++){             
            //xml = parser.parseFromString(response[j].data, 'text/xml');  
            //console.log(xml); 
            //console.log(response[j].data);
           // console.log("-------------------------");
            responseData.push(response[j].data);
        }
        
        //console.log(responseData.length);
        return responseData;
        
    }).then(data => {
        //console.log(data.length);
       // console.log("done");
        let xmlToJsonData=[];
        for(xml of data){
          //  console.log(xml);
            xmlToJsonData.push(convert.xml2json(xml, {
                compact: true,
                space: 4
            }))
        }
        //console.log(xmlToJsonData);
      //  console.log(req.query.envs);*/
        
        //res.set('Content-Type', 'application/json');       
        res.json(xmlToJsonData);
        //promises = [];
        //responseData = [];

       // return data;
      },
      (error) => {
      // var status = error.response.status
      });
   
});


app.listen(4000, function(){
    console.log("cors server now running on port 4000");
});
var express = require('express')
var cors = require('cors');
const bodyParser = require('body-parser');
const { response } = require('express');

const fetch = (...args) => import ('node-fetch').then(({default: fetch}) => fetch(...args));

const CLIENT_ID = "935f571cf46ad93a75b4"
const CLIENT_SECRET = "b8529168a351aad84adaebd82ff4da61b635d8e8"

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken',async function(req,res){

    req.query.code;
    const params = "?client_id="+CLIENT_ID+"&client_secret="+ CLIENT_SECRET +"&code="+req.query.code;
    await fetch("https://github.com/login/oauth/access_token"+params,{
        method: "POST",
        headers:{
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data)=> {
        console.log(data);
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
        console.log(data);
        res.json(data)
    })
})

app.listen(4000, function(){
    console.log("cors server now running on port 4000");
});
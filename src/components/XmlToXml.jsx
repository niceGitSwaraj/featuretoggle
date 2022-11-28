import React, { useState, Fragment, useEffect } from "react";
import axios from 'axios';
import ReadOnlyRow from "./XmlToXmlTableStruct";
import XmlToXmlTableStruct from "./XmlToXmlTableStruct";
import { json } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ReactDOM from 'react-dom';
//import "../App.css";

let jsonDataMaster = [];
let jsonDataSlave = [];
let envs = [];
let realRepoName = [];
let gitCommitHashes = [];
let gitCommitDates = [];
//let historicalReleaseNumbers = [];
let historicalReleaseFiles = [];
let releasesCounter=0;
var xml;
const parser = new DOMParser();
const bearerToken = process.env.REACT_APP_BEARER_TOKEN;


function XmlToXml(props) {  
  console.log(props.funcUser);
  console.log(bearerToken);
  if(!localStorage.getItem("user")){
    console.log(localStorage.getItem("user"));
    window.location.assign("http://localhost:3000/Login")
  }
  const [regionOne, setRegionOne] = useState("https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml");
  const [regionTwo, setRegionTwo] = useState("https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml");
  const [uids, setUIDS] = useState([]);
  const [selectedUID, setSelectedUID] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [regionNameOne, setRegionOneName] = useState("DEV");
  const [regionNameTwo, setRegionTwoName] = useState("DEV");
  const [historicalFilesNames, sethistoricalFileNames] = useState([]);
  const [selectedRelease, setSelectedRelese] = useState([]);  
  //const [historicalReleaseFiles, sethistoricalReleaseFiles] = useState([]);  
  const [historicalReleaseNumbers, setHistoricalReleaseNumbers] = useState([]);
  const [masterDataArray, setMasterData] = useState([]);
  var UIDS = [];
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let accessToken = urlParams.get("code");

  useEffect(() => {
    displayTables()
  },[masterDataArray]);


  
  async function getHistoricalReleases(commitHash,repo) {
    let temp = [];
    releasesCounter=0;
    console.log("called!!!");
    for(var j=0;j<commitHash.length;j++){
        axios.get(
          "https://raw.githubusercontent.com/nice-cxone/"+repo+"/"+commitHash[j]+"/toggles.xml",//'https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml',
          {headers: {
                  "Access-Control-Allow-Origin" : "*",
                  "content-type": "text/plain",
                  "Authorization": `Bearer `+bearerToken,
                  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
                  }   
          }
        )
        .then((response) => {                 
            historicalReleaseFiles.push(response.data);
                                                 
                  //console.log(parser.parseFromString(historicalReleaseFiles[0], 'text/xml'));
          },
          (error) => {
          // var status = error.response.status
          }
        ).finally(() => {
          console.log("historicalReleaseFiles.length: "+historicalReleaseFiles.length);         
            xml = parser.parseFromString(historicalReleaseFiles[releasesCounter], 'text/xml');
                if(xml.getElementsByTagName("documentation")[releasesCounter]){
                   if(historicalReleaseNumbers.indexOf(xml.getElementsByTagName("documentation")[releasesCounter].childNodes[0].parentNode.childNodes[1].innerHTML) == -1){                          
                    historicalReleaseNumbers.push(xml.getElementsByTagName("documentation")[releasesCounter].childNodes[0].parentNode.childNodes[1].innerHTML);                          
                    }
                }                            
          
          releasesCounter++;
          
          historicalReleaseNumbers.sort();
         // setHistoricalReleaseNumbers(temp);          
          console.log("releasesCounter: "+releasesCounter);
          console.log(historicalReleaseNumbers);          
          
        });
         
  } 
  }

  const getHistoricalHashes = (box) => {    
      
      let repo="";
      if(box=="Master"){
        repo = regionOne.split("/")[4];
      }else if(box == "Slave"){
        repo = regionTwo.split("/")[4];
      }     
      axios.get(
        "https://api.github.com/repos/nice-cxone/"+repo+"/commits?sha=master&path=toggles.xml&page=2&per_page=50",
        {headers: {
                "Access-Control-Allow-Origin" : "*",
                "content-type": "text/plain",
                "Authorization": `Bearer `+bearerToken,
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
                }   
        }
      )
      .then((response) => {    
        console.log("here!!!!!!!!!!!!!!!!!!!!!!!!!!!");        
          console.log(response);                
          for(var i=0;i<response["data"].length;i++){
                      // console.log(response["data"][i].sha);               
              gitCommitDates.push(response["data"][i]["commit"]["author"].date);              
              //console.log(response["data"][i]["commit"]["author"].date);              
              gitCommitHashes.push(response["data"][i].sha);               
          }          
          getHistoricalReleases(gitCommitHashes,repo);
          //console.log(response["data"][0].sha);                
        },
        (error) => {
        // var status = error.response.status
        }
      );
  }

  //getHistoricalHashes("Master");

  const getXMLData = (selectedRegion,box,repoName) => {
    console.log("getXMLData called: "+ selectedRegion);
    console.log("box: "+box);
    console.log("repoName: "+repoName);
    if(box=="Master"){      
      jsonDataMaster = [];     
      setRegionOneName(repoName);                   
    }
    else if(box=="Slave"){      
      jsonDataSlave = [];
      setRegionTwoName(repoName);
    }
    
    /*if(!selectedRegion){
      selectedRegion = 'https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml';
    }*/
      axios.get(
        selectedRegion,//'https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml',
        {headers: {
                "Access-Control-Allow-Origin" : "*",
                "content-type": "text/plain",
                "Authorization": `Bearer `+bearerToken,
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
                }   
        }
      )
      .then((response) => {       
        console.log("getXMLData called 2: "+ selectedRegion);        
        xml = parser.parseFromString(response.data, 'text/xml');    
        console.log(xml);  
              for ( var i = 0; i < xml.getElementsByTagName("feature").length ; i++ ){                   
                var offFor = parser.parseFromString(xml.getElementsByTagName("flipstrategy")[i]?xml.getElementsByTagName("flipstrategy")[i].childNodes[0].parentNode.childNodes[1].outerHTML:"could not retreive", 'text/xml');
                offFor = offFor.firstChild.hasAttribute("value")?offFor.firstChild.getAttribute("value"):"could not retreive";
                var onFor  = parser.parseFromString(xml.getElementsByTagName("flipstrategy")[i]?xml.getElementsByTagName("flipstrategy")[i].childNodes[0].parentNode.childNodes[3].outerHTML:"could not retreive", 'text/xml');
                onFor = onFor.firstChild.hasAttribute("value")?onFor.firstChild.getAttribute("value"):"could not retreive";
                
                //console.log(i);
                var jsonObject = {
                  "uid" : xml.getElementsByTagName("feature")[i].hasAttribute("uid")?xml.getElementsByTagName("feature")[i].getAttribute("uid"):"could not retreive",
                  "description" : xml.getElementsByTagName("feature")[i].getAttribute("description"),
                  "owner" : xml.getElementsByTagName("owner")[i]?xml.getElementsByTagName("owner")[i].innerHTML:"could not retreive",
                  "offFor" : offFor,
                  "onFor" : onFor,
                  "dependencies" : xml.getElementsByTagName("documentation")[i]?xml.getElementsByTagName("documentation")[i].childNodes[0].parentNode.childNodes[4].innerHTML:"could not retreive",
                  "release" : xml.getElementsByTagName("documentation")[i]?xml.getElementsByTagName("documentation")[i].childNodes[0].parentNode.childNodes[1].innerHTML:"could not retreive",
                };

                //console.log(jsonObject);
                if(box=="Master"){
                 // console.log("here master!!");
                  jsonDataMaster.push(jsonObject);                     
                  UIDS.push(jsonObject["uid"]);
                  //setContacts(jsonDataMaster);
                }
                else if(box=="Slave"){
                 // console.log("here slave!!");
                  jsonDataSlave.push(jsonObject); 
                 // console.log(jsonDataSlave[0].uid);                                  
                }
                                 
            }
            if(box=="Master"){
              setUIDS(UIDS);
            }
            console.log(uids);    
            console.log(jsonDataMaster[0].uid);
            
            console.log(contacts);
            
                    
        },
        (error) => {
         // var status = error.response.status
        }
      );
  }

  const getXMLS = () => {    
    //jsonDataMaster = [];
    let promises = [];

    for(let j=0;j<envs.length;j++){
        //console.log(envs[j]);
        let counter=0;
        promises.push(
        axios.get(
          "https://raw.githubusercontent.com/nice-cxone/"+envs[j]+"/master/toggles.xml",
          {headers: {
                  "Access-Control-Allow-Origin" : "*",
                  "content-type": "text/plain",
                  "Authorization": "Bearer "+bearerToken,//+accessToken
                  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
                  }   
          }
        ))
    }

    Promise.all(promises).then((response) => {  
          jsonDataMaster = [];//this is very inefficient. try to append new array by checking previous key so reinsertion doesnt happen.
          //console.log(promises);
          //console.log(response[0].data);
          for(let j=0;j<response.length;j++){             
          xml = parser.parseFromString(response[j].data, 'text/xml');    
          
          console.log(xml); 
          var jsonObject = []; 
          var jsonObject2 = {};
                for ( var i = 0; i < xml.getElementsByTagName("feature").length ; i++ ){                   
                  var offFor = parser.parseFromString(xml.getElementsByTagName("flipstrategy")[i]?xml.getElementsByTagName("flipstrategy")[i].childNodes[0].parentNode.childNodes[1].outerHTML:"could not retreive", 'text/xml');
                  offFor = offFor.firstChild.hasAttribute("value")?offFor.firstChild.getAttribute("value"):"could not retreive";
                  var onFor  = parser.parseFromString(xml.getElementsByTagName("flipstrategy")[i]?xml.getElementsByTagName("flipstrategy")[i].childNodes[0].parentNode.childNodes[3].outerHTML:"could not retreive", 'text/xml');
                  onFor = onFor.firstChild.hasAttribute("value")?onFor.firstChild.getAttribute("value"):"could not retreive";
                  let uid = xml.getElementsByTagName("feature")[i].hasAttribute("uid")?xml.getElementsByTagName("feature")[i].getAttribute("uid"):"could not retreive";
                 // console.log(xml.getElementsByTagName("flipstrategy")[i].childNodes[0].parentNode.childNodes[1].outerHTML.value);
                 // console.log(offFor);
                  var temp = {
                    "uid" : uid,
                    "description" : xml.getElementsByTagName("feature")[i].getAttribute("description"),
                    "owner" : xml.getElementsByTagName("owner")[i]?xml.getElementsByTagName("owner")[i].innerHTML:"could not retreive",
                    "offFor" : offFor,
                    "onFor" : onFor,
                    "dependencies" : xml.getElementsByTagName("documentation")[i]?xml.getElementsByTagName("documentation")[i].childNodes[0].parentNode.childNodes[4].innerHTML:"could not retreive",
                    "release" : xml.getElementsByTagName("documentation")[i]?xml.getElementsByTagName("documentation")[i].childNodes[0].parentNode.childNodes[1].innerHTML:"could not retreive",
                  };
                  //if(counter >= j){
                    for (var key in temp) {
                      if (temp.hasOwnProperty(key)) {
                          //
                          if(typeof temp[key] === "undefined" || temp[key] == "" || typeof temp[key] == null){
                            //console.log(key + " -> " + temp[key]);
                             temp[key] = "Empty";
                           //  console.log(key + " -> " + temp[key]);
                          }
                          
                      }
                    }
                    //console.log(uid);
                    jsonObject.push({'key':uid, 'val':temp});    
                    jsonObject2[uid] = temp;
                    //console.log(jsonObject2);
                    //console.log("here!!");                                                
                 // }                 
                 // counter=j;
              }          
                  
                  jsonDataMaster.push({'key':envs[j], 'val':jsonObject2});                         
                  
              
            }
             // console.log(jsonDataMaster);  
              //setMasterData(jsonDataMaster); 
              //console.log(masterDataArray);   
              return jsonDataMaster;                
          }
        ).then(data => {
          setMasterData(data);
          console.log(data); 
          //console.log(masterDataArray);
          //displayTables();
          //console.log(jsonStr);
        },
        (error) => {
        // var status = error.response.status
        });
        
    



  }
 
const handleChange = (checkbox,repo,repoRealName) => {  
    if(checkbox == true){
      envs.push(repo);
      realRepoName.push(repoRealName);
    }else{
      envs.pop(repo);
      realRepoName.pop(repoRealName);
    }    

    getXMLS();
    //displayTables();
    //const myTimeout = setTimeout(myGreeting, 5000);
}

 const displayTableData = (chosenFeature,compareAll) => {
  var comparison = [];
  var indexOfMasterUID = 0;
  var indexOfSlaveUID = 0;

  if(compareAll){
      console.log(chosenFeature);
      for(var j=0;j<chosenFeature.length;j++){
        console.log(jsonDataMaster.length);
        for(var i=0;i<jsonDataMaster.length;i++){
          //console.log(jsonDataMaster[i].uid);
          //console.log(chosenFeature);
          if(jsonDataMaster[i].uid==chosenFeature[j]){
            indexOfMasterUID = i;
            break;
          }
        }
       // console.log("indexOfMasterUID: "+indexOfMasterUID);

        for(var i=0;i<jsonDataSlave.length;i++){
          //console.log(jsonDataSlave[i].uid);
          //console.log(chosenFeature);
          if(jsonDataSlave[i].uid==chosenFeature[j]){
            indexOfSlaveUID = i;
            break;
          }
        }
        /*console.log("indexOfSlaveUID: "+indexOfSlaveUID);
        console.log(jsonDataMaster[indexOfMasterUID]);
        console.log(jsonDataSlave[indexOfSlaveUID]);*/
        jsonDataMaster[indexOfMasterUID].uid += ","+jsonDataSlave[indexOfSlaveUID].uid;
        jsonDataMaster[indexOfMasterUID].description += ","+jsonDataSlave[indexOfSlaveUID].description;
        jsonDataMaster[indexOfMasterUID].dependencies += ","+jsonDataSlave[indexOfSlaveUID].dependencies;
        jsonDataMaster[indexOfMasterUID].offFor += ","+jsonDataSlave[indexOfSlaveUID].offFor;
        jsonDataMaster[indexOfMasterUID].onFor += ","+jsonDataSlave[indexOfSlaveUID].onFor;
        jsonDataMaster[indexOfMasterUID].owner += ","+jsonDataSlave[indexOfSlaveUID].owner;
        jsonDataMaster[indexOfMasterUID].release += ","+jsonDataSlave[indexOfSlaveUID].release;
        console.log(jsonDataMaster[indexOfMasterUID]);

        comparison.push(jsonDataMaster[indexOfMasterUID]);
        //comparison.push(jsonDataSlave[indexOfSlaveUID]);
        indexOfMasterUID = 0;
        indexOfSlaveUID = 0;

        console.log(comparison);
        setContacts(comparison);
      }
  }
  else{
  //setContacts(jsonDataSlave);
  
  //comparison.push()
  
  console.log(jsonDataMaster.length);
  for(var i=0;i<jsonDataMaster.length;i++){
    console.log(jsonDataMaster[i].uid);
    console.log(chosenFeature);
    if(jsonDataMaster[i].uid==chosenFeature){
      indexOfMasterUID = i;
      break;
    }
  }
  console.log("indexOfMasterUID: "+indexOfMasterUID);

  for(var i=0;i<jsonDataSlave.length;i++){
    //console.log(jsonDataSlave[i].uid);
    //console.log(chosenFeature);
    if(jsonDataSlave[i].uid==chosenFeature){
      indexOfSlaveUID = i;
      break;
    }
  }
  console.log("indexOfSlaveUID: "+indexOfSlaveUID);
  console.log(jsonDataMaster[indexOfMasterUID]);
  console.log(jsonDataSlave[indexOfSlaveUID]);
  jsonDataMaster[indexOfMasterUID].uid += ","+jsonDataSlave[indexOfSlaveUID].uid;
  jsonDataMaster[indexOfMasterUID].description += ","+jsonDataSlave[indexOfSlaveUID].description;
  jsonDataMaster[indexOfMasterUID].dependencies += ","+jsonDataSlave[indexOfSlaveUID].dependencies;
  jsonDataMaster[indexOfMasterUID].offFor += ","+jsonDataSlave[indexOfSlaveUID].offFor;
  jsonDataMaster[indexOfMasterUID].onFor += ","+jsonDataSlave[indexOfSlaveUID].onFor;
  jsonDataMaster[indexOfMasterUID].owner += ","+jsonDataSlave[indexOfSlaveUID].owner;
  jsonDataMaster[indexOfMasterUID].release += ","+jsonDataSlave[indexOfSlaveUID].release;
  console.log(jsonDataMaster[indexOfMasterUID]);

  comparison.push(jsonDataMaster[indexOfMasterUID]);
  //comparison.push(jsonDataSlave[indexOfSlaveUID]);
  console.log(comparison);
  setContacts(comparison);
  }
 }


 const displayTables = () => {
     console.log("Entered DisplayTables funcion");
    //setMasterData(jsonDataMaster);
    //masterDataArray.sort((a,b)=> (a.val.uid > b.val.uid ? 1 : -1));
    console.log(masterDataArray); 
    /*
    of the arrays chosen, from the index, choose the largest object 
    start iterating from the 1st array. get data from the same indexes from other arrays.
    
    if UID from first array is found in the rest of the arrays,
     for each UID, put it inside of new array as a comma separated row
    for each UID that was not found, put it inside a different "notFound[]" array
    [found and same and found and different] and [not found]
    */
    let foundItems = [];
    let notFoundItems = [];
  

    for(let i=0;i<masterDataArray.length;i++){
        console.log(Object.keys(masterDataArray[i].val).length);
    }  
    ;
    if(masterDataArray.length>0){ //make sure this has some data before attempting to render.....
     // let counter = 0;//masterDataArray.length;
      console.log(masterDataArray[0].val);
       //for(let i=0;i<Object.keys(masterDataArray[0].val).length;i++){
            for(var items in masterDataArray[0].val){ //getting UID's which are stored as keys
                //console.log(masterDataArray[0].val[items]);
             // if(masterDataArray.length>=0){
                //console.log(masterDataArray[1].val);
                //let foundItemsObject = {};
                //storing the first envs data
                let uid = masterDataArray[0].val[items].uid+",";
                let description = masterDataArray[0].val[items].description+",";
                let dependencies = masterDataArray[0].val[items].dependencies+",";
                let offFor = masterDataArray[0].val[items].offFor+",";
                let onFor = masterDataArray[0].val[items].onFor+",";
                let owner = masterDataArray[0].val[items].owner+",";
                let release = masterDataArray[0].val[items].release+",";

                if(masterDataArray.length>1){
                  for(var i=1;i<masterDataArray.length;i++){      //continuing to append next envs data              
                    if(masterDataArray[i].val[items]){
                     // console.log("item found: "+ items);
                      uid +=  masterDataArray[i].val[items].uid+",";
                      description +=  masterDataArray[i].val[items].description+",";
                      dependencies +=  masterDataArray[i].val[items].dependencies+",";
                      offFor +=  masterDataArray[i].val[items].offFor+",";
                      onFor +=  masterDataArray[i].val[items].onFor+",";
                      owner +=  masterDataArray[i].val[items].owner+",";
                      release +=  masterDataArray[i].val[items].release+",";                      
                    }
                    else{
                      uid +=  "not avialable,";
                      description +=  "not avialable,";
                      dependencies +=  "not avialable,";
                      offFor +=  "not avialable,";
                      onFor +=  "not avialable,";
                      owner += "not avialable,";
                      release +=  "not avialable,"; 
                      //console.log("item NOT found: "+items);
                    }                    
                  }
                }
                  let foundItemsObject = {
                    "uid" : uid.slice(0, -1),
                    "description" : description.slice(0, -1),
                    "owner" :dependencies.slice(0, -1),
                    "offFor" : offFor.slice(0, -1),
                    "onFor" : onFor.slice(0, -1),
                    "dependencies" : owner.slice(0, -1),
                    "release" : release.slice(0, -1),
                  }
                  //console.log(foundItemsObject);
                  //if(uid !== "" && uid !== null){
                    //console.log(foundItemsObject);
                    foundItems.push(foundItemsObject);
                 // }
              //}

            }
            setContacts(foundItems);
        //}
    }
 
        
 }

 let repoHeading = realRepoName.map((repoName)=> {
  return <th>{repoName}</th>
})
    

  return (
    <>
    <div className="xmltoxml">
      <div class="container">
      <h1 class="font-weight-light">Xml-To-Xml Comparison</h1>            
        <div class="row align-items-center my-5">
        
            
          <div>
        
          <label>Compare All</label><input type="checkbox" id="compareAll" name="compareAll" onChange={() => {displayTableData(uids,true);}}/>
          <label>DEV </label><input type="checkbox" id="devCheckbox" name="devCheckbox" onChange={(event) => {handleChange(event.target.checked,"dev-feature-toggles","DEV")}}/>
          <label>Perf </label><input type="checkbox" id="perfCheckbox" name="perfCheckbox" onChange={(event) => {handleChange(event.target.checked,"perf-feature-toggles","Perf")}}/>
          <label>Production NA1 </label><input type="checkbox" id="prodNA1Checkbox" name="prodNA1Checkbox" onChange={(event) => {handleChange(event.target.checked,"prod-na1-feature-toggles","Production NA1")}}/>
          <label>FedRamp NA2 </label><input type="checkbox" id="fedRampNA2Checkbox" name="fedRampNA2Checkbox" onChange={(event) => {handleChange(event.target.checked,"prod-na2-feature-toggles","FedRamp NA2")}}/>
          <label>Europe </label><input type="checkbox" id="euCheckbox" name="euCheckbox" onChange={(event) => {handleChange(event.target.checked,"prod-eu1-feature-toggles","Europe")}} />
          <label>Australia </label><input type="checkbox" id="auCheckbox" name="auCheckbox" onChange={(event) => {handleChange(event.target.checked,"prod-au1-feature-toggles","Australia")}}/>
          <label>London </label><input type="checkbox" id="londonCheckbox" name="londonCheckbox" onChange={(event) => {handleChange(event.target.checked,"prod-uk1-feature-toggles","London")}}/>
          <label>Canada </label><input type="checkbox" id="caCheckbox" name="caCheckbox" onChange={(event) => {handleChange(event.target.checked,"prod-ca1-feature-toggles","Canada")}} />
          <label>Japan </label><input type="checkbox" id="jpCheckbox" name="jpCheckbox" onChange={(event) => {handleChange(event.target.checked,"prod-jp1-feature-toggles","Japan")}}/>
          <label>FedRAMP High </label><input type="checkbox" id="prodNA3Checkbox" name="prodNA3Checkbox" onChange={(event) => {handleChange(event.target.checked,"prod-na3-feature-toggles","FedRAMP High")}}/>
          </div>
        
         
        </div>
        
         
        
        <div>
        
        <table>
        
          <tbody>
            {contacts.map((contact) => (
              <Fragment>
                {
                  <XmlToXmlTableStruct
                    contact={contact}    
                    headings={repoHeading}             
                  />
                }
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </div>

    
    </div>
 
    
    
    </>
    
  );
  
}

export default XmlToXml;
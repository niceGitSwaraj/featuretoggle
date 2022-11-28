import React, { useState,useEffect } from "react";
import { render } from 'react-dom';
import $ from 'jquery';

 
let realRepoName = [];
//let rowColor;
let targetRow;
const XmlToXmlTableStruct = ({ contact,headings }) => {
  
  for(var i=0;i<headings.length;i++){ 
    if(realRepoName.indexOf(headings[i].props.children) === -1) {   
        realRepoName.push(headings[i].props.children);
    }
  }
  //console.log(realRepoName);
  let repoHeading = realRepoName.map((repoName)=> {
    return <th>{repoName}</th>
  })
  const [uidRowColor, setUIDRowColor] = useState("");
  //setTableHeadings(headings[0].props.children);
  /*useEffect(() => {
    displayTables()
  },[masterDataArray]);*/

  //console.log(typeof(contact.uid));
  //console.log(contact.description);
  /*const uid = contact.uid == "undefined"?contact.uid.split(","):"Empty,";
  const description = contact.description == "undefined"?contact.description.split(","):"Empty,";
  const offFor = contact.offFor == "undefined"?contact.offFor.split(","):"Empty,";
  const onFor = contact.onFor == "undefined"?contact.onFor.split(","):"Empty,";
  const owner = contact.owner == "undefined"?contact.owner.split(","):"Empty,";
  const dependencies = contact.dependencies == "undefined"?contact.dependencies.split(","):"Empty,";
  const release = contact.release == "undefined"?contact.release.split(","):"Empty,";*/
  const uid = contact.uid.split(",");
  const description = contact.description.split(",");
  const offFor = contact.offFor.split(",");
  const onFor = contact.onFor.split(",");
  const owner = contact.owner.split(",");
  const dependencies = contact.dependencies.split(",");
  const release = contact.release.split(",");

  let uidMismatch = false;
  let descriptionMismatch = "";
  let offForMismatch = false;
  let onForMismatch = false;
  let ownerMismatch = false;
  let dependenciesMismatch = false;
  let releaseMismatch = false;
  let rowColor;
  let rowName;
  
 //the extra td is because of the comma at the end....


 const getColor = (objectName,tableColumn) => {   
  //setTableHeadings("Dev"); 
  if(objectName[0].trim() != tableColumn.trim()){ //we only need to compare the first element with the rest of them
   // setUIDRowColor("red"); 
   if(realRepoName.length>1){
     
      if(targetRow !== rowName){
        rowColor = "red";
        rowName = targetRow; 
        console.log(rowName+" - "+rowColor+" "+realRepoName.length);
      }      
    }   
    return "red";
  }  
  //uidRowColor = "#0ec74f";
  //setUIDRowColor("#0ec74f");
  rowColor = "#0ec74f";
  return '';
};

if(uid.length>0){  
      uidMismatch = uid.map((thisUID)=> {
        return <><td style={{background : getColor(uid,thisUID)}}>{thisUID}</td></>;          
      })
      descriptionMismatch = description.map((thisDesc)=> {         
          return <><td style={{background : getColor(description,thisDesc)}}>{thisDesc}</td></>;          
      })
      offForMismatch = offFor.map((thisoffFor)=> {
        return <><td style={{background : getColor(offFor,thisoffFor)}}>{thisoffFor}</td></>;          
      })
      onForMismatch = onFor.map((thisonFor)=> {
        return <><td style={{background : getColor(onFor,thisonFor)}}>{thisonFor}</td></>;          
      })
      ownerMismatch = owner.map((thisOwner)=> {
        return <><td style={{background : getColor(owner,thisOwner)}}>{thisOwner}</td></>;          
      })
      dependenciesMismatch = dependencies.map((thisDependencies)=> {
        return <><td style={{background : getColor(dependencies,thisDependencies)}}>{thisDependencies}</td></>;          
      })
      releaseMismatch = release.map((thisRelease)=> {
        return <><td style={{background : getColor(release,thisRelease)}}>{thisRelease}</td></>;          
      })
}
      
const expandRow = () => {
  $("[data-toggle='myCollapse']").click(function( ev ) { 
    console.log(ev);
    ev.preventDefault();
    var target;
    if (this.hasAttribute('data-target')) {
        target = $(this.getAttribute('data-target'));
        console.log(target+"sdas");
    } else {
        target = $(this.getAttribute('href'));
    };
    target.toggleClass("in");
    console.log(target.hasClass('in'));
  });
}
targetRow = uid;
targetRow = targetRow.includes(',')?targetRow.substring(0, targetRow.indexOf(',')):targetRow;  
targetRow = targetRow[0];    
let targetRowID = "#"+targetRow;

const getRowColor = (objectName,tableColumn) => { 
  //setTableHeadings("Dev"); 
   //we only need to compare the first element with the rest of them
   // setUIDRowColor("red"); 
   if(realRepoName.length>1){
      if(objectName !== rowName){
        rowColor = "red";
        rowName = objectName; 
        console.log(rowName+" - "+rowColor+" "+realRepoName.length);
      }   
  }
}
   //console.log(targetRow);
  return (    
    <>
    <button type="button" class="btn" data-toggle="myCollapse" data-target={targetRowID} onClick={expandRow} style={{background : "#0ec74f" }}>
            {targetRow}
    </button>
    <br></br>
          
    <tr id={targetRow} class="myCollapse"><td>
          <thead>
            <tr>
              <th>Details</th>              
              {repoHeading}
            </tr>            
          </thead>
            <tr>
              <td><b>FeatureID(UID):</b></td>
              {uidMismatch}
            </tr>    
            <tr>
              <td><b>Description:</b></td>
              {descriptionMismatch}
            </tr>
            <tr>
              <td><b>OffFor:</b></td>
              {offForMismatch}
            </tr>
            <tr>
              <td><b>OnFor:</b></td>
              {onForMismatch}
            </tr>
            <tr>
              <td><b>Owner:</b></td>
              {ownerMismatch}
            </tr>
            <tr>
              <td><b>Dependencies:</b></td>
              {dependenciesMismatch}
            </tr>
            <tr>      
              <td><b>Release Version:</b></td>
              {releaseMismatch}
            </tr>
    </td></tr>
    <br>
    </br>
    </>
    
  );  
  
};

export default XmlToXmlTableStruct;

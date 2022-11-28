import React, { useState, Fragment, useEffect } from "react";
//import { nanoid } from "nanoid";
//import "./App.css";
import data from "../mock-data.json";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from 'axios';

//console.log(data);


let jsonData = [];
var xml;
const parser = new DOMParser();




const Home = () => {
  const [region, setRegion] = useState("https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml");
  console.log({region}.region);
  const [contacts, setContacts] = useState([]);
  useEffect(() =>{ getXMLData(); },[]);
  const [addFormData, setAddFormData] = useState({
    uid: "",
    description: "",
    owner: "",
    offFor: "",
    onFor: "",
    release: "",
  });

  const getXMLData = () => {
    console.log("getXMLData called: "+ {region});
      axios.get(
        {region}.region,//'https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml',
        {headers: {
                "Access-Control-Allow-Origin" : "*",
                "content-type": "text/plain",
                "Authorization": `Bearer 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`,
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT"
                }   
        }
      )
      .then((response) => {       
        console.log("getXMLData called 2: "+ {region});        
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
                  "release:" : xml.getElementsByTagName("documentation")[i]?xml.getElementsByTagName("documentation")[i].childNodes[0].parentNode.childNodes[1].innerHTML:"could not retreive",
                };
                jsonData.push(jsonObject);      
                                 
            }
            setContacts(jsonData);
        },
        (error) => {
         // var status = error.response.status
        }
      );
  }
 

  const [editFormData, setEditFormData] = useState({
    uid: "",
    description: "",
    owner: "",
    offFor: "",
    onFor: "",
    release: "",
  });

  const [editContactId, setEditContactId] = useState(null);

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newContact = {
      //id: nanoid(),
      uid: addFormData.uid,
      description: addFormData.description,
      owner: addFormData.owner,
      offFor: addFormData.offFor,
      onFor: addFormData.onFor,
      release: addFormData.release,
    };

    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    
    const editedContact = {
      //id: editContactId,
      uid: editFormData.uid,
      description: editFormData.description,
      owner: editFormData.owner,
      offFor: editFormData.offFor,
      onFor: editFormData.onFor,
      release: editFormData.release,
    };
   
    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.uid === editContactId);

    newContacts[index] = editedContact;

    setContacts(newContacts);
    //console.log(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.uid);
    
    const formValues = {
      uid: contact.uid,
      description: contact.description,
      owner: contact.owner,
      offFor: contact.offFor,
      onFor: contact.onFor,
      release: contact.release,
    };
    console.log(formValues);
    //console.log(contact.release);
    
    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.uid === contactId);

    newContacts.splice(index, 1);

    setContacts(newContacts);
  };
  //setContacts(jsonData);

  const triggerEvents = (url) => {
    setRegion(url);
    getXMLData();
    jsonData = [];
  }
  
/*function XmlToXml(){
  return <h2>xml to xml</h2>;
}*/
  return (
    
    <div className="app-container"> 
    

    <div>
            <select value={region} onChange={(event) => {triggerEvents(event.target.value)}}>
                <option value={'https://raw.githubusercontent.com/nice-cxone/dev-feature-toggles/master/toggles.xml'}>Dev</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/perf-feature-toggles/master/toggles.xml'}>Perf</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-na1-feature-toggles/master/toggles.xml'}>Production NA1</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-na2-feature-toggles/master/toggles.xml'}>FedRamp NA2</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-eu1-feature-toggles/master/toggles.xml'}>Europe</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-au1-feature-toggles/master/toggles.xml'}>Australia</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-uk1-feature-toggles/master/toggles.xml'}>London</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-ca1-feature-toggles/master/toggles.xml'}>Canada</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-jp1-feature-toggles/master/toggles.xml'}>Japan</option>
                <option value={'https://raw.githubusercontent.com/nice-cxone/prod-na3-feature-toggles/master/toggles.xml'}>FedRAMP High</option>
            </select>
            <p>region: {region}</p>
      </div>
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>UID</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Off-For</th>
              <th>On-For</th>
              <th>Release</th>
              <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <Fragment>
                {editContactId === contact.uid ? (
                  <EditableRow
                    editFormData={editFormData}
                    handleEditFormChange={handleEditFormChange}
                    handleCancelClick={handleCancelClick}
                  />
                ) : (
                  <ReadOnlyRow
                    contact={contact}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </form>

      <h2>Insert New Feature Toggle</h2>
      <form id="insertToggleForm" onSubmit={handleAddFormSubmit}>
      <div>
      Dev <input type="checkbox" id="DevCheckbox" name="DevCheckbox" /><br></br>       
      Staging <input type="checkbox" id="stagingCheckbox" name="stagingCheckbox" /><br></br>       
      Test <input type="checkbox" id="testCheckbox" name="testCheckbox"  /><br></br>      
      Perf <input type="checkbox" id="perfCheckbox" name="perfCheckbox"  /><br></br>
      optionx <input type="checkbox" id="optionxCheckbox" name="optionxCheckbox"  /><br></br>
      </div>
      
        <input
          id="inputUID"
          type="text"
          name="uid"
          required="required"
          placeholder="Enter UID..."
          onChange={handleAddFormChange}
        />
        <input
          id="inputDescription"
          type="text"
          name="description"
          required="required"
          placeholder="Enter a description..."
          onChange={handleAddFormChange}
        />
        <input
          id="inputOwner"
          type="text"
          name="owner"
          required="required"
          placeholder="Enter owners Name..."
          onChange={handleAddFormChange}
        />
        <input
          id="inputoffFor"
          type="text"
          name="offFor"
          required="required"
          placeholder="Enter Off For Tentants(comma separated of multiple)..."
          onChange={handleAddFormChange}
        />
        <input
          id="inputonFor"
          type="text"
          name="onFor"
          required="required"
          placeholder="Enter On For Tentant(comma separated of multiple)..."
          onChange={handleAddFormChange}
        />
        <input
          id="inputRelease"
          type="text"
          name="release"
          required="required"
          placeholder="Enter Release Version"
          onChange={handleAddFormChange}          
        />
        <button id="insertFormSubmitButton" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;

import React from "react";

const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{contact.uid}</td>
      <td>{contact.description}</td>
      <td>{contact.owner}</td>
      <td>{contact.offFor}</td>
      <td>{contact.onFor}</td>
      <td>{contact.release}</td>
      <td>
        <button
          type="button"
          onClick={(event) => handleEditClick(event, contact)}
        >
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(contact.uid)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;

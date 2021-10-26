import React from "react";
import NavBar from "./NavBar";
import CardForm from "./CardForm";

/*
Renders component for adding a card to the deck
@param {Function} newCard: Creates a card object in the database
@return {ReactElement} JSX of the AddCard component
*/
function AddCard({ newCard }) {
  return (
    <div className="add-card-container">
      <NavBar page={"Add Card"} />
      <h3>React Router: Add Card</h3>
      <CardForm cardFunction={newCard} option={"Add"} />
    </div>
  );
}

export default AddCard;
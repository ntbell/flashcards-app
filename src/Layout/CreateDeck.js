import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import NavBar from "./NavBar";

/*
Renders component for adding a deck
@param {Function} newDeck: Create a deck object in database
@return {ReactElement} JSX of the CreateDeck component
*/
function CreateDeck({ newDeck }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();

  //Handlers for adding the new deck
  const handleSubmit = async (event) => {
    event.preventDefault();
    const deck = { name: name, description: description };
    const deckId = await newDeck(deck);
    history.push(`/decks/${deckId}`);
  }
  const handleCancel = () => {
    setName("");
    setDescription("");
    history.push("/");
  }
  const handleNameChange = (event) => setName(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  return (
    <div className="create-deck-container">
      <NavBar page={"Create Deck"} />
      <h3 class="font-weight-bold">Create Deck</h3>
      <form onSubmit={handleSubmit}>
        <label class="w-100">
          Name
          <br />
          <input 
            type="text" 
            id="name" 
            class="form-control"
            value={name} 
            onChange={handleNameChange} 
            placeholder="Deck Name" 
          />
        </label>
        <label class="w-100">
          Description
          <br />
          <textarea 
            id="description" 
            class="form-control" 
            value={description} 
            onChange={handleDescriptionChange} 
            placeholder="Brief description of the deck" 
          />
        </label>
        <button 
          type="button" 
          class="btn btn-secondary mr-1 py-2" 
          onClick={handleCancel}>
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary py-2">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateDeck;
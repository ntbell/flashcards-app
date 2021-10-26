import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readDeck } from "../utils/api";
import NavBar from "./NavBar";

/*
Renders component for editing a deck
@param {Function} editDeck: Edit a deck object in database
@return {ReactElement} JSX of the EditDeck component
*/
function EditDeck({ editDeck }) {
  const history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { deckId } = useParams();
  const abortController = new AbortController();
  const signal = abortController.signal;

  //Handlers for editing a deck
  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedDeck = { id: deckId, name: name, description: description };
    await editDeck(updatedDeck);
    history.push(`/decks/${deckId}`)
  }
  const handleNameChange = (event) => setName(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  //Side effect for calling API
  useEffect(() => {
    getCard();
    return () => {
      abortController.abort();
    }
  }, [deckId])

  //Pulls a deck object from the API
  const getCard = async () => {
    try {
      const response = await readDeck(deckId, signal);
      setName(response.name);
      setDescription(response.description);
    } catch (error) {
      if (error !== "AbortController") {
        throw error;
      }
    }
  }

  return (
    <>
      <NavBar page={"Edit Deck"} />
      <h3 class="font-weight-bold">Edit Deck</h3>
      <form onSubmit={handleSubmit}>
        <label class="w-100">
          Name
          <br />
          <input
            type="text"
            value={name}
            class="form-control"
            onChange={handleNameChange}
            placeholder={name}
          />
        </label>
        <br />
        <label class="w-100">
          Description
          <br />
          <textarea
            value={description}
            class="form-control"
            onChange={handleDescriptionChange}
            placeholder={description}
          />
        </label>
        <br />
        <button
          type="button"
          class="btn btn-secondary mr-1 py-2"
          onClick={() => history.push(`/decks/${deckId}`)}>
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary py-2">
          Submit
        </button>
      </form>
    </>
  );
}

export default EditDeck;
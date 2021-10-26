import React from "react";
import { useHistory } from "react-router-dom";

/*
@param {Array} decks: An array of deck objects
@param {Function} removeDeck: Removes the deck from the database
@return {ReactElement} Renders decks and a button to create more
*/
function DeckList({ decks, removeDeck }) {
  const history = useHistory();

  //Formats each deck object into JSX
  let formattedDecks = decks.map((deck, index) => (
    <div key={index} className="deck-container" class="border border-2 border-secondary my-2 p-3">
      <div class="d-flex justify-content-between">
        <h4>{deck.name}</h4>
        <p>{deck.cards.length} cards</p>
      </div>
      <div>
        <p class="text-justify">{deck.description}</p>
        <button
          class="btn btn-secondary oi oi-eye py-2 mr-2"
          onClick={() => history.push(`/decks/${deck.id}`)}>
          View
        </button>
        <button
          class="btn btn-primary oi oi-book py-2"
          onClick={() => history.push(`/decks/${deck.id}/study`)}>
          Study
        </button>
        <button
          class="btn btn-danger oi oi-trash float-right"
          id={deck.id}
          onClick={() => removeDeck(deck.id)}>
        </button>
      </div>
    </div>
  ));

  return (
    <>
      <button class="btn btn-secondary oi oi-plus py-2" onClick={() => history.push("/decks/new")}>  Create Deck</button>
      {formattedDecks}
    </>
  );
}

export default DeckList;
import React from "react";
import { useHistory, useParams } from "react-router-dom";

/*
Component renders a "Not enough cards" messge if there are less than 3 cards in the deck
@param {Number} cardCount: The amount of cards in the deck
@return {ReactElement} JSX for the message with an "Add Cards" button
*/
function NotEnough({ cardCount }) {
  const history = useHistory();
  const { deckId } = useParams();

  return (
    <div>
      <h3 class="font-weight-bold pb-3">Not enough cards.</h3>
      <p class="pb-1">You need at least 3 cards to study. There are {cardCount} cards in this deck</p>
      <button 
        class="btn btn-primary oi oi-plus" 
        onClick={() => history.push(`/decks/${deckId}/cards/new`)}>
        Add Cards
      </button>
    </div>
  );
}

export default NotEnough;
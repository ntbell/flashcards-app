import React from "react";
import { useHistory, useParams } from "react-router-dom";

/*
Renders a single card object given a path containing the deckId to pull from
@param {Object} card: A single card object
@param {Function} removeCard: Removes the card from the database
@return {ReactElement} JSX of each card component with deckId
*/
function CardView({ card, removeCard }) {
  const { deckId } = useParams();
  const history = useHistory();

  return (
    <div className="card-container" class="border border-secondary p-2">
      <div class="d-flex justify-content-between flex-wrap">
        <p>{card.front}</p>
        <p>{card.back}</p>
      </div>
      <div class="text-right">
        <button
          class="btn btn-secondary oi oi-pencil p-2 mr-1"
          onClick={() => history.push(`/decks/${deckId}/cards/${card.id}/edit`)}>
          Edit
        </button>
        <button
          class="btn btn-danger oi oi-trash p-2"
          onClick={() => removeCard(card.id)}>
        </button>
      </div>
    </div>
  );
}

export default CardView;
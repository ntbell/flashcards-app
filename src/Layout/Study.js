//displayed at /decks/:deckId/study
import React, { useState, useEffect } from "react";
import NotEnough from "./NotEnough";
import { useHistory, useParams } from "react-router-dom";
import { readDeck } from "../utils/api/index";
import NavBar from "./NavBar";

/*
Renders the "Study" option for viewing the cards in the given deck
@return {ReactElement} JSX for studying action
*/
function Study() {
  const { deckId } = useParams();
  const history = useHistory();
  const abortController = new AbortController();
  const signal = abortController.signal;
  const [deck, setDeck] = useState({});
  const [card, setCard] = useState({});
  const [flip, setFlip] = useState(false);
  const [count, setCount] = useState(0);

  //Side effect for the API
  useEffect(() => {
    prepareDeck();
    return () => {
      abortController.abort();
    }
  }, [deckId])

  //Pulls the deck from the API then sets the card and deck states
  const prepareDeck = async () => {
    try {
      const response = await readDeck(deckId, signal);
      setDeck(response);
      setCard(response.cards[0]);
    } catch (error) {
      if (error !== "AbortController") {
        throw error;
      }
    }
  }

  //Handler for pressing the "Next" button and loading the next card in the deck
  const handleNextCard = () => {
    //If currently on the last card
    if (count + 1 === deck.cards.length) {
      //Confirm decision
      if (window.confirm("Restart cards?\nClick 'cancel' to return to the home page.")) {
        setCount(0);
        setCard(deck.cards[0]);
        //Otherwise navigate to home
      } else {
        history.push("/");
      }
      //If not on the last card
    } else {
      //Move to the next card and increment the count
      setCount((count) => {
        setCard(deck.cards[count + 1]);
        return count + 1;
      });
    }
    //Always flip to the front after pressing "Next"
    setFlip(false);
  }

  //Render only if the deck has a "cards" key
  if (!Object.keys(deck).includes("cards")) return null;

  return (
    <div>
      <NavBar page={"Study"} />
      <h2 class="font-weight-bold py-3">Study: {deck.name}</h2>
      {/*Render cards if the deck has more than 2 cards within*/}
      {deck.cards.length > 2 ? (
        <div className="card-container" class="border border-2 border-dark my-2 p-3">
          <h4>Card {count + 1} of {deck.cards.length}</h4>
          {/*Render the front or back of the card based on the flip state. ***Tests fail if button is moved outside of conditional*/}
          {!flip ?
            (
              <>
                <p>{card.front}</p>
                <button
                  type="button"
                  class="btn btn-secondary"
                  onClick={() => setFlip((flip) => !flip)}>
                  Flip
                </button>
              </>
            ) : (
              <>
                <p>{card.back}</p>
                <button
                  type="button"
                  class="btn btn-secondary py-2"
                  onClick={() => setFlip((flip) => !flip)}>
                  Flip
                </button>
                <button
                  type="button"
                  class="btn btn-primary py-2"
                  onClick={handleNextCard}>
                  Next
                </button>
              </>
            )
          }
        </div>
      ) : (<NotEnough cardCount={deck.cards.length} />)}
    </div>
  );
}

export default Study;


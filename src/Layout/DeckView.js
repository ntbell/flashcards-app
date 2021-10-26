import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readDeck } from "../utils/api/index";
import CardView from "./CardView";
import NavBar from "./NavBar";

/*
Renders a deck and its keys, as well as the CardView component for each card object inside
@param {Function} removeDeck: Removes the deck from the database
@param {Function} removeCard: Removes the card from the database
@return {ReactElement} The deck and list of cards
*/
function DeckView({ removeDeck, removeCard }) {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const { deckId } = useParams();
    const history = useHistory();
    const [deck, setDeck] = useState({});

    //Side effect for calling API
    useEffect(() => {
        getDeck();
        return () => {
            abortController.abort();
        }
    }, [deckId])

    //Pulls the deck object from the API
    const getDeck = async () => {
        try {
            const response = await readDeck(deckId, signal);
            setDeck(response);
        } catch (error) {
            if (error !== "AbortController") {
                throw error;
            }
        }
    }

    //Ensure that the deck object has keys before attempting render
    if (Object.keys(deck).length > 0) {

        //Call <CardView /> to render the cards within the deck
        const viewCards = deck.cards.map((card) => <CardView key={card.id} card={card} removeCard={removeCard} />);

        //Return the single deck and the cards within
        return (
            <>
                <NavBar page={deck.name} />
                <div class="mb-2">
                    <h4>{deck.name}</h4>
                    <p>{deck.description}</p>
                    <button
                        class="btn btn-secondary oi oi-pencil mr-1 py-2"
                        onClick={() => history.push(`/decks/${deckId}/edit`)}>
                        Edit
                    </button>
                    <button
                        class="btn btn-primary oi oi-book mr-1 py-2"
                        onClick={() => history.push(`/decks/${deckId}/study`)}>
                        Study
                    </button>
                    <button
                        class="btn btn-primary oi oi-plus py-2"
                        onClick={() => history.push(`/decks/${deckId}/cards/new`)}>
                        Add Cards
                    </button>
                    <button
                        class="btn btn-danger oi oi-trash float-right"
                        onClick={() => removeDeck(deckId)}>
                    </button>
                </div>
                <div class="my-3">
                    <h4 class="font-weight-bold">Cards</h4>
                    {viewCards}
                </div>
            </>
        );
    } else { return null; } //Return null if there are no keys in the deck object
}

export default DeckView;
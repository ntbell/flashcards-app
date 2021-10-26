import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readCard } from "../utils/api";

/*
Form for creating or editing a card
@param {Function} cardFunction: Creates or edits a card object in the database
@param {String} option:  "Edit" or "Add" option
@return {ReactElement} A form for the manipulation of a card object
*/
function CardForm({ cardFunction, option }) {
    const { deckId, cardId } = useParams();
    const history = useHistory();
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const abortController = new AbortController();
    const signal = abortController.signal;

    //Handlers for editing or adding a card -- determined by {option}
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (option === "Edit") {
            const updatedCard = { id: cardId, front: front, back: back, deckId: deckId };
            await cardFunction(updatedCard);
        } else {
            const card = { front: front, back: back };
            await cardFunction(card, deckId);
        }
    }
    const handleFrontChange = (event) => setFront(event.target.value);
    const handleBackChange = (event) => setBack(event.target.value);

    //Side effect for calling API only on "Edit"
    useEffect(() => {
        if (option === "Edit") {
            getCard();
            return () => {
                abortController.abort();
            }
        }
    }, [deckId, cardId, option])

    //Pulls the card object from the API on "Edit"
    const getCard = async () => {
        try {
            const response = await readCard(cardId, signal);
            setFront(response.front);
            setBack(response.back);
        } catch (error) {
            if (error !== "AbortController") {
                throw error;
            }
        }
    }

    //Returns the form with conditionals depending on "Edit" or "Add" option
    return (
        <form onSubmit={handleSubmit}>
            <label class="w-100">
                Front
                <textarea
                    value={front}
                    class="form-control"
                    onChange={handleFrontChange}
                    placeholder={option === "Edit" ? (front) : ("Front side of card")}
                />
            </label>
            <label class="w-100">
                Back
                <textarea
                    value={back}
                    class="form-control"
                    onChange={handleBackChange}
                    placeholder={option === "Edit" ? (back) : ("Back side of card")}
                />
            </label>
            <button
                type="button"
                class="btn btn-secondary mr-1 py-2"
                onClick={() => history.push(`/decks/${deckId}`)}>
                {option === "Edit" ? ("Cancel") : ("Done")}
            </button>
            <button
                type="submit"
                class="btn btn-primary py-2">
                {option === "Edit" ? ("Submit") : ("Save")}
            </button>
        </form>
    );
}

export default CardForm;
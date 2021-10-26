import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { listDecks, createDeck, updateDeck, deleteDeck, createCard, updateCard, deleteCard } from "../utils/api/index";
import Header from "./Header";
import NotFound from "./NotFound";
import CreateDeck from "./CreateDeck";
import Deck from "./Deck";
import DeckList from "./DeckList";

function Layout() {
  const history = useHistory();
  const abortController = new AbortController();
  const signal = abortController.signal;
  const [decks, setDecks] = useState([]);

  //Gets decks on first render
  useEffect(() => {
    getDecks();
    return () => { 
      abortController.abort();
    }
  }, []);

  //Gets current decks from database
  async function getDecks() {
    try {
      const response = await listDecks(signal);
      setDecks(response);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("aborted");
      } else {
        throw error;
      }
    }
  }

  //Adds a new deck to the current decks
  //Returns the ID of the new deck
  async function newDeck(deck) {
    const response = await createDeck(deck, signal);
    getDecks();
    return response.id;
  }

  async function editDeck(deck) {
    const response = await updateDeck(deck, signal);
    getDecks();
    return response.id;
  }

  async function removeDeck(id) {
    if (window.confirm("Delete this deck?\nYou will not be able to recover it.")) {
      await deleteDeck(id, signal);
      getDecks();
      history.push("/");
    }
  }

  async function newCard(card, id) {
    const response = await createCard(id, card, signal);
    getDecks();
    return response.id;
  }

  async function editCard(card) {
    const response = await updateCard(card, signal);
    getDecks();
    return response.id;
  }

  async function removeCard(id) {
    if (window.confirm("Delete this card?\nYou will not be able to recover it.")) {
      await deleteCard(id, signal);
      getDecks();
      history.go(0);
    }
  }


  return (
    <div className="container">
      <Header />
      <Switch>
        <Route exact path="/">
          <DeckList decks={decks} removeDeck={removeDeck} />
        </Route>
        <Route path="/decks/new">
          <CreateDeck newDeck={newDeck} />
        </Route>
        <Route path="/decks/:deckId">
          <Deck editDeck={editDeck} removeDeck={removeDeck} newCard={newCard} editCard={editCard} removeCard={removeCard} />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>

    </div>
  );
}


export default Layout;

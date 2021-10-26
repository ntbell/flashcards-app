import React, { useState, useEffect } from "react";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { readDeck } from "../utils/api";

/*
Builds a breadcrumb nav bar
@param {String} page: The current page at the end of the url
@return {ReactElement} An adaptable navigation bar depending on the url
*/
function NavBar({ page }) {
  const { deckId, cardId } = useParams();
  const abortController = new AbortController();
  const signal = abortController.signal;
  const [deckName, setDeckName] = useState("");
  const { url } = useRouteMatch();

  //Side effect for retrieving the deck object if given an id
  useEffect(() => {
    if (deckId) getDeck(deckId, signal);
    return () => {
      abortController.abort();
    }
  }, [deckId, signal]);

  //Pulls the deck from the API
  const getDeck = async () => {
    const response = await readDeck(deckId);
    setDeckName(response.name);
  }

  //Builds a breadcrumb path with the pieces of the url
  const fillBreadcrumb = () => {

    //Get rid of the first "/" then slice the url by "/"
    const pathArray = url.substring(1).split("/");
    //Stores <li> pieces of the breadcrumb nav
    const outputArray = [];

    //For every piece of the url
    for (let endPoint of pathArray) {

      //Check the cases to create the navbar
      switch (endPoint) {
        case "decks":  //For all components containing "/decks" except "/decks/new" which is handled by {case "new":}
          if (page !== "Create Deck") {
            outputArray.push(<li key={outputArray.length} class="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckName}</Link></li>);
          }
          break;
        case "new":  //For <CreateDeck /> and <AddCard /> components
          if (pathArray[1] === "new") {
            outputArray.push(<li key={outputArray.length} class="breadcrumb-item"><Link to="/decks/new">Create Deck</Link></li>);
          } else {
            outputArray.push(<li key={outputArray.length} class="breadcrumb-item"><Link to={`/decks/${deckId}/cards/new`}>Add Card</Link></li>);
          }
          break;
        case "study":  //For <Study /> component
          outputArray.push(<li key={outputArray.length} class="breadcrumb-item"><Link to={`/decks/${deckId}/study`}>Study</Link></li>);
          break;
        case "edit":  //For <EditDeck /> and <EditCard /> components
          if (pathArray[2] === "edit") {
            outputArray.push(<li key={outputArray.length} class="breadcrumb-item"><Link to={`/decks/${deckId}/edit`}>Edit Deck</Link></li>);
          } else {
            outputArray.push(<li key={outputArray.length} class="breadcrumb-item"><Link to={`/decks/${deckId}/cards/${cardId}/edit`}>Edit Card {cardId}</Link></li>);
          }
          break;
        default:
          break;
      }
    }

    //Slice off the last item in the breadcrumb nav so that it can be remade into an unclickable <li>
    return (
      <>
        {outputArray.slice(0, -1)}
        <li key={outputArray.length + 1} class="breadcrumb-item">{page}</li>
      </>
    );
  }

  //Add a "Home" link first, and return the completed breadcrumb nav
  return (
    <nav>
      <ul class="breadcrumb">
        <li key={0} class="breadcrumb-item">
          <a href="/" class="oi oi-home"> Home</a>
        </li>
        {fillBreadcrumb()}
      </ul>
    </nav>
  );
}

export default NavBar;
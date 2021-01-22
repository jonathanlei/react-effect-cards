import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Card from "./Card";
const DECK_ID_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
/*
 * Props: none
 * States:
    deckId
    cardsOnBoard [{
              "image": "https://deckofcardsapi.com/static/img/KH.png",
              "value": "KING",
              "suit": "HEARTS",
              "code": "KH"
          },... ]
    Update
 * App => GameBoard => Card
 */
function GameBoard() {
  const timerId = useRef(null);
  const [cardsOnBoard, setCardsOnBoard] = useState([]);
  const [deckId, setDeckId] = useState("");
  const [drawingCard, setDrawingCard] = useState(false);
  const [autoDrawing, setAutoDrawing] = useState(false);
  const [shufflingDeck, setShufflingDeck] = useState(false);

  /* set deckid on mount */
  useEffect(function getDeckIdOnMount() {
    async function getDeckId() {
      const resp = await axios.get(DECK_ID_URL);
      setDeckId(id => resp.data.deck_id);
    }
    getDeckId();
  }, []);
  /* helper function to get random rotate angle */
  function getrandomAngle() {
    return Math.floor(Math.random() * 120) - 60;
  }

  /* draw a card every second */
  useEffect(function setCounter() {
    if (autoDrawing) {
      timerId.current = setInterval(handleDrawingCard, 1000);
    }
    return cleanUpClearTimer;
  }, [timerId, autoDrawing]);

  /* clean up function */
  function cleanUpClearTimer() {
    clearInterval(timerId.current);
    //reset
    timerId.current = null;
  };
  //baseurl
  /* draw a new card and put card on board
   * Gets card from DRAWCARDURL
   * adds card to state: "cardsOnBoard"
   */
  useEffect(function putCardOnBoard() {
    async function getCard() {
      const drawCardURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
      const resp = await axios.get(drawCardURL);
      setCardsOnBoard(cards => [...cards, { ...resp.data.cards[0], key: uuid(), angle: getrandomAngle() }]);
    }
    if (drawingCard) getCard();
    setDrawingCard(false);
  }, [drawingCard, deckId]);

  /* draw a new card and put card on board
   * Gets card from DRAWCARDURL
   * adds card to state: "cardsOnBoard"
   */
  useEffect(function shuffleDeck() {
    async function getShuffledDeck() {
      const shuffleDeckURL = `https://deckofcardsapi.com/api/deck/${deckId}/shuffle`;
      await axios.get(shuffleDeckURL);
      setCardsOnBoard([]);
      setShufflingDeck(false);
    }
    if (shufflingDeck) getShuffledDeck();
  }, [shufflingDeck, deckId]);

  /**
   * Handles the click of "Shuffle Deck" button
   * sets shufflingdeck = true
   * disables "shuffle deck" button event handler
   */
  function handleShuffle(evt) {
    setShufflingDeck(true);
  }

  /**
   * handle drawing card button click
   * change drawingCard to true
   * If user has drawn 52 cards: sends Alert "No more cards to draw!"
   * */
  function handleDrawingCard() {
    if (cardsOnBoard.length < 52) setDrawingCard(true);
    else alert("No more cards to draw!");
  }


  // render button functions 
  /* * Handles the click of "auto draw" button
   * toggle autoDrawing value true/false
    */
  function handleAutoDraw() {
    setAutoDrawing(!autoDrawing);
  }

  return (<div className="GameBoard">
    <button className="GameBoard-draw-button btn btn-secondary" onClick={handleDrawingCard}>Gimme a Card!</button>
    <button className="GameBoard-shuffle-button btn btn-warning" onClick={(shufflingDeck) ? null : handleShuffle}>Shuffle Deck</button>
    <button className="GameBoard-shuffle-button btn btn-dark" onClick={(shufflingDeck) ? null : handleAutoDraw}> {autoDrawing ? "Stop Auto Draw" : "Start Auto Draw"}</button>
    <div className="GameBoard-cardDeck mt-5">
      {cardsOnBoard.map(c => <Card image={c.image} code={c.code} key={c.key} angle={c.angle} />)}
    </div>
  </div>)
}
// generate angle state in card for random angle
export default GameBoard;

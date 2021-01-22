import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuid} from "uuid";
import Card from "./Card";
const DECKIDURL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
/* 
States:
  deckId  
  cardsOnBoard [{
              "image": "https://deckofcardsapi.com/static/img/KH.png",
              "value": "KING",
              "suit": "HEARTS",
              "code": "KH"
          },... ]

App => GameBoard => Card 
 */
function GameBoard() {
  const [cardsOnBoard, setCardsOnBoard] = useState([]);
  const [deckId, setDeckId] = useState("");
  let drawingCard = false;
  /* set deckid on mount */
  useEffect(function getDeckIdOnMount() {
    async function getDeckId() {
      const resp = await axios.get(DECKIDURL);
      setDeckId(id => resp.data.deck_id);
    }
    getDeckId();
  }, []);

  /* draw a new card and put card on board */
  useEffect(function putCardOnBoard() {
    async function getCard() {
      const DRAWCARDURL = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
      const resp = await axios.get(DRAWCARDURL);
      setCardsOnBoard(cards => [...cards, {...resp.data.cards[0], key: uuid()} ]);
    }
    getCard();
    return function finishDraw() {
      drawingCard = false;
    }
  }, [drawingCard])

  /* handle drawing card button click and change drawingCard to true*/
  function handleDrawingCard(){
    drawingCard = true;
  }
  return (<div className="GameBoard">
    <button className="GameBoard-draw-button" onClick={handleDrawingCard}>Gimme a Card!</button>
    {cardsOnBoard.map(c => <Card image={c.image} code={c.code}/>)}
  </div>)
}

export default GameBoard;
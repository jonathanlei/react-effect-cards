import React from "react";

/* 
  Props: 
    image: "https://deckofcardsapi.com/static/img/KH.png",
    code: "KH"
  App => GameBoard => Card
 */
function Card({ image, code, angle }) {
  return <img 
    className="Card position-absolute"
    src={image} 
    alt={code} 
    id={code} 
    style={{transform: `rotate(${angle}deg)`}} />;
}


export default Card;
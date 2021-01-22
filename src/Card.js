import React from "react";

/* 
  Props: 
    image: "https://deckofcardsapi.com/static/img/KH.png",
    code: "KH"
  App => GameBoard => Card
 */
function Card({image,code}){
  return <img src={image} alt={code} id={code} />;
}

export default Card;
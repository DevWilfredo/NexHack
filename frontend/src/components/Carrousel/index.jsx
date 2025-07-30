import React, { useState, useEffect } from "react";

import CardComponent from "../CardComponent";

//Este carrousel tienes que enviar cuantas cartas por slide quieres mostrar
//Tambien tienes que enviar el array de users y eso envia la info al card Component.
//Con un ternario podrias cambiar el cardComponent al comentComponent me parece
const CardCarousel = ({
  usersArray = [],
  initialSlide = 0,
  cardsPerSlide = 2,
  viewport = "small",
  hackathonStatus = "",
  teamData = null, // <-- valor por defecto
}) => {
  const showButtons = hackathonStatus === "finished";
  const totalSlides = Math.ceil(usersArray.length / cardsPerSlide);
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const getSlideItems = () => {
    const start = currentSlide * cardsPerSlide;
    return usersArray.slice(start, start + cardsPerSlide);
  };

  return (
    <div className="w-auto bg-base-300 mx-auto">
      <div className=" max-w-auto bg-base-300">
        <div className="flex justify-center  gap-5 p-4 bg-base-300 rounded-box">
          {getSlideItems().map((users, index) => (
            <CardComponent
              userArray={users}
              key={index}
              sizeToview={viewport}
              showLikeButton={showButtons}
              showCommentButton={showButtons}
              teamData={teamData}
            />
          ))}
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <button className="btn btn-circle hover:btn-info" onClick={prevSlide}>
            ❮
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button className="btn btn-circle hover:btn-info" onClick={nextSlide}>
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};
export default CardCarousel;

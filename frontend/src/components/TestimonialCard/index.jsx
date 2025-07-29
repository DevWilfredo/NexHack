import { Star, StarHalf, StarOff } from "lucide-react";
import React from "react";

function renderStars(rating) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Estrella completa
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />);
    } else if (rating >= i - 0.5) {
      // Media estrella
      stars.push(<StarHalf key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />);
    } else {
      // Sin estrella
      stars.push(<StarOff key={i} className="w-5 h-5 text-yellow-400" />);
    }
  }

  return stars;
}

function TestimonialCard({ name, bio, image, quote, rating }) {
  return (
    <div className="flex w-full p-4 max-w-lg flex-col rounded-xl bg-base-200 shadow-lg">
      <div className="flex items-center gap-4 text-base-content">
        <img
          src={image}
          alt={name}
          className="h-[58px] w-[58px] rounded-full object-cover object-center"
        />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-semibold">{name}</h5>
            <div className="flex gap-0.5">{renderStars(rating)}</div>
          </div>
          <p className="text-xs font-semibold uppercase text-base-content/40 mt-0.5">
            {bio}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-base text-base-content leading-relaxed">{quote}</p>
      </div>
    </div>
  );
}

export default TestimonialCard;

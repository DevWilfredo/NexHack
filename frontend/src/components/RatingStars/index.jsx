import React from "react";

function RaitingStarsComponent({ value, onChange }) {
  const handleChange = (e) => {
    const stars = parseFloat(e.target.getAttribute("aria-label")); // e.g. "2.5 star"
    onChange(stars * 2);
    // convierte a base 10
  };

  return (
    <div className="rating rating-lg rating-half">
      <input
        type="radio"
        name="rating"
        className="rating-hidden"
        onChange={handleChange}
      />
      {[...Array(10)].map((_, i) => {
        const half = i % 2 === 0 ? "mask-half-1" : "mask-half-2";
        const starValue = (i + 1) / 2;
        const checked = value === starValue * 2;
        return (
          <input
            key={i}
            type="radio"
            name="rating"
            className={`mask mask-star-2 ${half} bg-warning`}
            aria-label={`${starValue} star`}
            onChange={handleChange}
            checked={checked}
          />
        );
      })}
    </div>
  );
}

export default RaitingStarsComponent;

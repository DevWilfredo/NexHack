import React from "react";

function StaticStarsComponent({ value }) {
  return (
    <div className="rating rating-lg rating-half pointer-events-none select-none">
      {[...Array(10)].map((_, i) => {
        const half = i % 2 === 0 ? "mask-half-1" : "mask-half-2";
        const starValue = (i + 1) / 2; // (0.5 to 5.0)
        const checked = value / 2 === starValue;

        return (
          <input
            key={i}
            type="radio"
            name={`readonly-stars-${value}`} // unique name to avoid conflict
            className={`mask mask-star-2 ${half} bg-warning`}
            aria-label={`${starValue} star`}
            disabled
            checked={checked}
            readOnly
          />
        );
      })}
    </div>
  );
}

export default StaticStarsComponent;

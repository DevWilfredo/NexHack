import React, { useId } from "react";

function StaticStarsComponent({ value, small = false }) {
  const id = useId(); // <-- genera ID único por instancia
  const ratingSizeClass = small
    ? "rating-sm md:rating-md"
    : "rating-lg md:rating-lg";

  return (
    <div
      className={`rating rating-half ${ratingSizeClass} pointer-events-none select-none`}
    >
      {[...Array(10)].map((_, i) => {
        const half = i % 2 === 0 ? "mask-half-1" : "mask-half-2";
        const starValue = (i + 1) / 2;
        const checked = Math.abs(value / 2 - starValue) < 0.01;

        return (
          <input
            key={i}
            type="radio"
            name={`readonly-stars-${value}-${id}`} // ✅ name único por instancia
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

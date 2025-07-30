import { useState } from "react";

function Rating5StarsComponent({ value = 0, onChange }) {
  const [rating, setRating] = useState(value);

  const handleChange = (newRating) => {
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  return (
    <div className="rating rating-lg">
      {[1, 2, 3, 4, 5].map((star) => (
        <input
          key={star}
          type="radio"
          name="rating"
          className="mask mask-star-2 bg-warning"
          aria-label={`${star} star`}
          checked={rating === star}
          onChange={() => handleChange(star)}
        />
      ))}
    </div>
  );
}

export default Rating5StarsComponent;

// components/TestimonialCarousel.jsx
import React, { useState, useEffect } from "react";

import JudgesReviewComponent from "../JudgesReview";

const TestimonialCarousel = ({
  testimonials = [],
  initialSlide = 0,
  cardsPerSlide = 2,
}) => {
  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);
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
    return testimonials.slice(start, start + cardsPerSlide);
  };

  return (
    <div className="relative w-full bg-base-300 rounded-box p-4">
      <div className="flex justify-center gap-5">
        {getSlideItems().map((testimonial, index) => (
          <JudgesReviewComponent
            key={index}
            name={testimonial.name}
            role={testimonial.role}
            image={testimonial.image}
            quote={testimonial.quote}
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
  );
};

export default TestimonialCarousel;

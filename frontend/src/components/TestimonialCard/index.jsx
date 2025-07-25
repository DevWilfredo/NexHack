// components/TestimonialCard.jsx
import { Star } from "lucide-react";
import React from "react";

const stars = [1, 2, 3, 4, 5];

function TestimonialCard({ name, role, image, quote }) {
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
            <div className="flex gap-0.5">
              {stars.map((i) => (
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor"/>
              ))}
            </div>
          </div>
          <p className="text-xs font-semibold uppercase text-base-content/40 mt-0.5">
            {role}
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

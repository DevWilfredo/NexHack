import { MessageSquareDashed } from "lucide-react";
import TestimonialCard from "../TestimonialCard";

const chunkArray = (array, size) => {
  
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const TestimonialsSection = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <MessageSquareDashed className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-lg text-gray-500">Este usuario aún no tiene testimonios</p>
      </div>
    );
  }

  

  const chunkSize = 3;
  const slides = chunkArray(testimonials, chunkSize);
  console.log(testimonials)
  return (
    <div className="w-full mt-8">
      <h3 className="text-2xl font-semibold text-base-content mb-4">
        Testimonios de compañeros
      </h3>

      <div className="carousel w-full rounded-box">
  {slides.map((group, idx) => (
    <div
      key={idx}
      id={`slide${idx + 1}`}
      className="carousel-item relative w-full flex flex-col items-center justify-center"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl px-4">
        {group.map((testimonial, subIdx) => (
          <TestimonialCard
            key={subIdx}
            name={`${testimonial.from_user.firstname} ${testimonial.from_user.lastname}`}
            quote={testimonial.message}
            bio={testimonial.from_user.bio || "Usuario"}
            image={
              testimonial.from_user.profile_picture
                ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${testimonial.from_user.profile_picture}`
                : `https://placehold.co/100x100?text=${testimonial.from_user.firstname?.charAt(0) || "U"}`
            }
            rating={testimonial.rating || 0}
          />
        ))}
      </div>

      {/* Solo mostrar flechas si hay al menos 4 testimonios */}
      {testimonials.length > 3 && (
        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
          <a
            href={`#slide${idx === 0 ? slides.length : idx}`}
            className="btn btn-circle btn-sm"
          >
            ❮
          </a>
          <a
            href={`#slide${idx + 2 > slides.length ? 1 : idx + 2}`}
            className="btn btn-circle btn-sm"
          >
            ❯
          </a>
        </div>
      )}
    </div>
  ))}
</div>

    </div>
  );
};

export default TestimonialsSection;

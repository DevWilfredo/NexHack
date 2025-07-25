import { MessageSquareDashed } from "lucide-react";
import TestimonialCard from "../TestimonialCard";

// Simulación de testimonials
const testimonials = [
  {
    name: "Alice Mendoza",
    role: "Frontend @ Spotify",
    image: "https://i.pravatar.cc/100?img=32",
    quote: "Loved the collaboration style. Super clean and organized.",
  },
  {
    name: "Brian Lee",
    role: "DevRel @ Vercel",
    image: "https://i.pravatar.cc/100?img=29",
    quote: "One of the fastest developers I've seen. Highly recommend.",
  },
  {
    name: "Carlos Rivera",
    role: "Software Eng @ Meta",
    image: "https://i.pravatar.cc/100?img=21",
    quote: "Innovative approach to problems. Great experience.",
  },
  {
    name: "Diana Lopez",
    role: "PM @ Google",
    image: "https://i.pravatar.cc/100?img=40",
    quote: "Excellent communication and delivery speed.",
  },
  {
    name: "Ethan Chen",
    role: "AI Engineer @ OpenAI",
    image: "https://i.pravatar.cc/100?img=44",
    quote: "Code was clean, well-tested, and production-ready.",
  },
  {
    name: "Fatima Noor",
    role: "Design Lead @ Figma",
    image: "https://i.pravatar.cc/100?img=47",
    quote: "Best UI implementation I've reviewed. Precise and consistent.",
  },
  {
    name: "George Smith",
    role: "CTO @ IndieStack",
    image: "https://i.pravatar.cc/100?img=38",
    quote: "Understood requirements instantly and delivered with polish.",
  },
  {
    name: "Hana Kim",
    role: "Security @ Cloudflare",
    image: "https://i.pravatar.cc/100?img=45",
    quote: "Focused, fast, and fun to work with. Would hire again.",
  },
  {
    name: "Ivan Petrov",
    role: "DevOps @ DigitalOcean",
    image: "https://i.pravatar.cc/100?img=35",
    quote: "Great attention to detail and performance optimization.",
  },
  {
    name: "Julia Nguyen",
    role: "Tech Lead @ Notion",
    image: "https://i.pravatar.cc/100?img=30",
    quote: "Amazing design system usage and component architecture.",
  },
  {
    name: "Kevin Osei",
    role: "Cloud Engineer @ AWS",
    image: "https://i.pravatar.cc/100?img=37",
    quote: "Infrastructure work was top-notch. Smooth deployment.",
  },
  {
    name: "Luna Park",
    role: "ML Researcher @ DeepMind",
    image: "https://i.pravatar.cc/100?img=48",
    quote: "Innovative thinking and deeply technical. A joy to work with.",
  },
];

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const TestimonialsSection = () => {
  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <MessageSquareDashed className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-lg text-gray-500">No hay reviews disponibles</p>
      </div>
    );
  }

  const chunkSize = 3;
  const slides = chunkArray(testimonials, chunkSize);

  return (
    <div className="w-full mt-8">
      <h3 className="text-2xl font-semibold text-base-content mb-4">
        Reviews del Usuario
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
                  name={testimonial.name}
                  quote={testimonial.quote}
                  role={testimonial.role}
                  image={testimonial.image}
                />
              ))}
            </div>

            {/* Flechas de navegación DaisyUI */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;

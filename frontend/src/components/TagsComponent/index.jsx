import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DynamicIcon from "../DynamicIcon";
import { useTheme } from "@context/ThemeContext";

const TagsComponent = ({ tags, activeTagId, setActiveTagId, extraClasses }) => {
  const { isDark } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const tagsPerSlide = 10;

  const slides = useMemo(() => {
    const allTags = [{ id: "all", name: "Todos los tópicos", icon: null }, ...tags];
    const result = [];
    for (let i = 0; i < allTags.length; i += tagsPerSlide) {
      result.push(allTags.slice(i, i + tagsPerSlide));
    }
    return result;
  }, [tags]);

  const pillBase = `inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer`;
  const lightPill = `bg-white border-base-300 text-base-content`;
  const darkPill = `bg-base-200 border-slate-700 text-white`;
  const activePill = isDark
    ? "bg-accent text-white border-primary"
    : "bg-primary text-white border-primary";

  const handleTagClick = (id) => setActiveTagId(id);

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  return (
    <div className={`w-full py-4 space-y-4 ${extraClasses}`}>
      {/* Slide controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="btn btn-ghost btn-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-3 justify-center flex-wrap">
          <AnimatePresence mode="wait">
            {slides.length > 0 && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="flex gap-3 flex-wrap justify-center"
              >
                {slides[currentSlide].map((tag) => (
                  <span
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`${pillBase} ${
                      activeTagId === tag.id
                        ? activePill
                        : isDark
                        ? darkPill
                        : lightPill
                    }`}
                  >
                    {tag.icon && (
                      <DynamicIcon
                        iconName={tag.icon}
                        className="w-4 h-4 opacity-80 text-base-content"
                      />
                    )}
                    {tag.name}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === slides.length - 1}
          className="btn btn-ghost btn-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicadores (opcional) */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-primary" : "bg-base-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsComponent;

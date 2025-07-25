import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import DynamicIcon from "../DynamicIcon";
import { useTheme } from "@context/ThemeContext";

const TagsComponent = ({ tags, activeTagId, setActiveTagId, extraClasses }) => {
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const visibleCount = 9;
  const visibleTags = expanded ? tags : tags.slice(0, visibleCount);

  const pillBase = `inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer`;
  const lightPill = `bg-white border-base-300 text-base-content`;
  const darkPill = `bg-base-200 border-slate-700 text-white`;
  const activePill = isDark
    ? "bg-accent text-white border-primary"
    : "bg-primary text-white border-primary";

  const toggleExpanded = () => setExpanded(!expanded);

  const handleTagClick = (id) => setActiveTagId(id);

  return (
    <div
      className={`w-full py-4 space-y-4  ${extraClasses} rounded-xl
       `}
    >
      {/* Tag pills */}
      <div className="flex flex-wrap gap-3 justify-center ">
        <AnimatePresence initial={false}>
          {/* Static "All" pill */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span
              onClick={() => handleTagClick("all")}
              className={`${pillBase} ${
                activeTagId === "all"
                  ? activePill
                  : isDark
                  ? darkPill
                  : lightPill
              }`}
            >
              Todos los tópicos
            </span>
          </motion.div>

          {visibleTags.map((tag) => (
            <motion.div
              key={tag.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <span
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
                    className="w-4 h-4 opacity-80"
                  />
                )}
                {tag.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ver más / menos */}
      {/* {tags.length > visibleCount && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <button
            onClick={toggleExpanded}
            className="p-2 rounded-full shadow-md border border-base-300 
               hover:scale-110 duration-200 bg-base-100 transition-all"
            title={expanded ? "Ver menos" : "Ver más"}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </motion.div>
      )} */}
    </div>
  );
};

export default TagsComponent;

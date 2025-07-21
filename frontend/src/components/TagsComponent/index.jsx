import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import DynamicIcon from "../DynamicIcon";
import { useTheme } from "@context/ThemeContext";

const TagsComponent = ({ tags }) => {
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const visibleCount = 8;

  const visibleTags = expanded ? tags : tags.slice(0, visibleCount);
  const pillBg = isDark ? "bg-slate-900/80" : "bg-primary";
  const pillHover = isDark ? 'hover:bg-slate-600' : 'hover:bg-[#015A89]'


  return (
    <div className="relative flex">
      <div className="flex gap-4 flex-wrap w-full py-3">
        {visibleTags.map((tag) => (
          <button
            key={tag.id}
            className={`flex items-center gap-2 rounded-full ${pillBg} ${pillHover} text-white text-sm px-4 py-2 font-medium duration-200 hover:scale-105 transition-all cursor-pointer `}
          >
            {tag.icon && <DynamicIcon iconName={tag.icon} />}
            {tag.name}
          </button>
        ))}

        {tags.length > visibleCount && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-ghost px-2 text-sm"
            title={expanded ? "Ver menos" : "Ver más"}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        )}
      </div>
    </div>
  );
};

export default TagsComponent;

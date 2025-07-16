import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const TagsComponent = ({ tags }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = 6; // mostrar 6 tags por defecto

  const visibleTags = expanded ? tags : tags.slice(0, visibleCount);

  return (
    <div className=" relative flex justify-center p-3">
      <div className="flex gap-2 flex-wrap">
        {visibleTags.map((tag) => (
          <button
            key={tag.id}
            className="btn btn-primary text-success shadow-sm shadow-accent"
          >
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

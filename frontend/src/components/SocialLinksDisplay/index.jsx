import React from "react";
import { Globe, Github, Linkedin, Mail } from "lucide-react";

const iconMap = {
  website: Globe,
  github: Github,
  linkedin: Linkedin,
  email: Mail,
};

const cleanDisplayValue = (type, value) => {
  if (type === "email") return value;

  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");
    const pathname = url.pathname.replace(/^\/+|\/+$/g, "");

    if (type === "linkedin") {
      return pathname;
    }

    if (!pathname) {
      return hostname;
    }

    return `${hostname}/${pathname}`;
  } catch (e) {
    return value;
  }
};

function SocialLinkDisplay({ type, value, label, isMissing }) {
  const Icon = iconMap[type];
  const isEmail = type === "email";
  const href = isEmail ? `mailto:${value}` : value;
  const displayValue = isMissing ? value : cleanDisplayValue(type, value);

  return (
    <div className="w-full">
      {label && (
        <p className="text-xs text-muted-foreground mb-1 ml-1">{label}</p>
      )}

      {isMissing ? (
        <div className="flex items-center gap-2 rounded text-sm text-muted-foreground italic">
          <Icon className="w-4 h-4 shrink-0" />
          <span>{displayValue}</span>
        </div>
      ) : (
        <a
          href={href}
          target={isEmail ? "_self" : "_blank"}
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded transition text-sm text-base-content break-all group"
        >
          <Icon className="w-4 h-4 text-base-content shrink-0" />
          <span className="group-hover:underline select-text">
            {displayValue}
          </span>
        </a>
      )}
    </div>
  );
}

export default SocialLinkDisplay;

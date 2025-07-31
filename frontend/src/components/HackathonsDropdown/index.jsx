// components/HackathonDropdown.jsx

import { useState } from "react";
import { NavLink } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@context/AppContext";

const roleColors = {
  creator: "bg-green-200 text-green-800",
  judge: "bg-blue-200 text-blue-800",
  participant: "bg-yellow-200 text-yellow-800",
};

const HackathonsDropdown = ({
  linkText = "text-base-content",
  linkHover = "hover:bg-primary/50 hover:text-base-content hover:font-semibold",
  activeLink = "bg-primary text-white font-semibold",
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { myHackathons: hackathons } = useApp();

  return (
    <div className="px-3">
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className={`w-full flex items-center justify-between py-2 px-2 rounded-lg ${linkText} ${linkHover} ${
          openDropdown ? activeLink : ""
        }`}
      >
        <span className="text-sm font-semibold">Mis Hackathons</span>
        {openDropdown ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {openDropdown && (
          <motion.ul
            key="dropdown"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mt-2 space-y-1 overflow-hidden"
          >
            {hackathons.length === 0 ? (
              <li className="text-sm text-muted-foreground italic px-2">
                Aún no te has inscrito en ningún hackathon
              </li>
            ) : (
              hackathons
                .filter((h) => h.status !== "finished")
                .map((hackathon) => (
                  <li key={hackathon.id}>
                    <NavLink
                      to={`/hackathons/${hackathon.id}`}
                      className={`px-3 py-2 rounded-md transition-all flex justify-between items-center ${linkText} ${linkHover}`}
                    >
                      <span className="truncate text-sm font-medium">
                        {hackathon.title}
                      </span>
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                          roleColors[hackathon.role] ||
                          "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {hackathon.role}
                      </span>
                    </NavLink>
                  </li>
                ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HackathonsDropdown;

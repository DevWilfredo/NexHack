import React, { useState } from "react";
import {
  LayoutDashboard,
  CircleUserRound,
  Trophy,
  Mails,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { NavLink } from "react-router";
import { useApp } from "@context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@context/AuthContext";

const roleColors = {
  creator: "bg-green-200 text-green-800",
  judge: "bg-blue-200 text-blue-800",
  participant: "bg-yellow-200 text-yellow-800",
};

const Sidebar = () => {
  const { myHackathons: hackathons } = useApp();
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);

  const linkBase =
    "flex items-center px-3 py-2 rounded-lg transition-colors duration-300";
  const linkText = "text-base-content";
  const linkHover =
    "hover:bg-primary/50 hover:text-base-content hover:font-semibold";
  const activeLink = "bg-primary text-white font-semibold";

  const links = [
    { icon: LayoutDashboard, text: "Dashboard", to: "/dashboard" },
    { icon: CircleUserRound, text: "Perfil", to: `profile/${user.id}` },
    { icon: Trophy, text: "Leaderboard", to: "/leaderboard" },
    { icon: Mails, text: "Solicitudes", to: "/requests" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-base-300 border-r border-base-content/10 sticky top-0">
      <div className="flex flex-col justify-between flex-1">
        <nav className="-mx-3 space-y-2">
          {links.map(({ icon: Icon, text, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [linkBase, linkText, linkHover, isActive ? activeLink : ""].join(" ")
              }
            >
              <Icon className="w-5 h-5" />
              <span className="mx-2 text-sm font-medium">{text}</span>
            </NavLink>
          ))}

          <div className="divider" />

          {/* Mis Hackathons Dropdown */}
          <div className="mt-6 px-3">
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
                    hackathons.map((hackathon) => (
                      <li key={hackathon.id}>
                        <NavLink
                          to={`/hackathons/${hackathon.id}`}
                          className={`block px-3 py-2 rounded-md transition-all flex justify-between items-center ${linkText} ${linkHover}`}
                        >
                          <span className="truncate text-sm font-medium">
                            {hackathon.title}
                          </span>
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                              roleColors[hackathon.role] || "bg-gray-200 text-gray-800"
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
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useState } from "react";
import {
  LayoutDashboard,
  CircleUserRound,
  Trophy,
  Mails,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "@context/ThemeContext";
import { NavLink } from "react-router";

const Sidebar = () => {
  const { isDark } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(false);

  const linkBase =
    "flex items-center px-3 py-2 rounded-lg transition-colors duration-300";
  const linkText = isDark ? "text-gray-200" : "text-gray-600";
  const linkHover = isDark
    ? "hover:bg-gray-800 hover:text-white"
    : "hover:bg-gray-100 hover:text-gray-700";
  const activeLink = isDark
    ? "bg-accent text-white font-semibold"
    : "bg-primary text-white font-semibold";

  const links = [
    { icon: LayoutDashboard, text: "Dashboard", to: "/dashboard" },
    { icon: CircleUserRound, text: "Perfil", to: "/profile" },
    { icon: Trophy, text: "Leaderboard", to: "/" },
    { icon: Mails, text: "Solicitudes", to: "/" },
  ];

  const hackathons = [
    { id: 1, title: "Hackathon de Verano" },
    { id: 2, title: "AI Challenge 2025" },
    { id: 3, title: "Hack4Good" },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto ${
        isDark
          ? "bg-slate-900/80 border-slate-800/80"
          : "bg-base-300 border-gray-300"
      } border-r sticky top-0`}
    >
      <div className="flex flex-col justify-between flex-1">
        <nav className="-mx-3 space-y-2">
          {links.map(({ icon: Icon, text, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  linkBase,
                  linkText,
                  linkHover,
                  isActive ? activeLink : "",
                ].join(" ")
              }
            >
              <Icon className="w-5 h-5" />
              <span className="mx-2 text-sm font-medium">{text}</span>
            </NavLink>
          ))}

          <div className="divider"></div>

          {/* Mis Hackathons Dropdown */}
          <div className="mt-6 px-3">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className={`w-full flex items-center justify-between py-2 px-2 rounded-lg ${linkText} ${linkHover}`}
            >
              <span className="text-sm font-semibold">Mis Hackathons</span>
              {openDropdown ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openDropdown && (
              <ul className="mt-2 space-y-1">
                {hackathons.map((hackathon) => (
                  <li key={hackathon.id}>
                    <a
                      href="#"
                      className={`block text-sm px-3 py-1 rounded-md truncate ${
                        isDark
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {hackathon.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

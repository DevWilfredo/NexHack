import React, { useState } from "react";
import { LayoutDashboard, CircleUserRound, Trophy, Mails } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "@context/AuthContext";
import HackathonsDropdown from "@components/HackathonsDropdown";

const Sidebar = () => {
  const { user } = useAuth();

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

          <div className="divider" />

          {/* Mis Hackathons Dropdown */}
          <HackathonsDropdown
            linkText={linkText}
            linkHover={linkHover}
            activeLink={activeLink}
          />
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

import { NavLink, useLocation } from "react-router";
import { useEffect } from "react";
import Avatar from "@components/Avatar";
import ThemeToggler from "@components/ThemeToogler";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@context/AuthContext";
import nexhackLogo from "@assets/nexhack.png";
import nechackBlue from "@assets/nexhackBlue.png";
import NotificationBell from "@components/NotificationBell";
import { useApp } from "@context/AppContext";
import {
  LayoutDashboard,
  CircleUserRound,
  Trophy,
  Mails,
  Menu,
  Home as HomeIcon,
  LogIn,
  UserPlus,
} from "lucide-react";
import HackathonsDropdown from "../HackathonsDropdown";

const Navbar = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const publicLinks = [{ icon: HomeIcon, text: "Home", to: "/" }];
  const privateLinks = [
    { icon: LayoutDashboard, text: "Dashboard", to: "/dashboard" },
    { icon: CircleUserRound, text: "Perfil", to: `/profile/${user?.id}` },
    { icon: Trophy, text: "Leaderboard", to: "/leaderboard" },
    { icon: Mails, text: "Solicitudes", to: "/requests" },
  ];

  const authLinks = [
    { icon: LogIn, text: "Login", to: "/login" },
    { icon: UserPlus, text: "Registro", to: "/register" },
  ];

  const linkText = "text-base-content";
  const linkHover =
    "hover:bg-primary/50 hover:text-base-content hover:font-semibold";
  const activeLink = "bg-primary text-white font-semibold";

  const links = user
    ? [...publicLinks, ...privateLinks]
    : [...publicLinks, ...authLinks];

  const getBtnClass = (isActive) =>
    isActive ? `btn btn-sm btn-primary` : "btn btn-ghost btn-sm";

  useEffect(() => {
    const drawerCheckbox = document.getElementById("my-drawer-3");
    if (drawerCheckbox && drawerCheckbox.checked) {
      drawerCheckbox.checked = false;
    }
  }, [location.pathname]);

  return (
    <div
      className={`navbar bg-base-200 shadow-sm sticky top-0 z-20 backdrop-blur-lg`}
    >
      <div className="navbar-start flex items-center gap-2">
        <div className="drawer">
          <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex items-center">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost md:hidden"
            >
              <Menu />
            </label>
            <NavLink to="/" className="text-xl">
              <img
                src={isDark ? nexhackLogo : nechackBlue}
                alt="Nexhack"
                className="w-40 h-auto"
              />
            </NavLink>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 min-h-full w-72 p-4 space-y-2">
              {links.map(({ icon: Icon, text, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300",
                      isDark ? "text-gray-200" : "text-gray-600",
                      isDark
                        ? "hover:bg-gray-800 hover:text-white"
                        : "hover:bg-gray-100 hover:text-gray-700",
                      isActive
                        ? isDark
                          ? "bg-accent text-white font-semibold"
                          : "bg-primary text-white font-semibold"
                        : "",
                    ].join(" ")
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{text}</span>
                </NavLink>
              ))}

              {/* 👇 Solo mostrar si está logueado */}
              {user && (
                <>
                  <div className="divider" />

                  {/* Mis Hackathons Dropdown */}
                  <HackathonsDropdown
                    linkText={linkText}
                    linkHover={linkHover}
                    activeLink={activeLink}
                  />
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="navbar-end gap-2 items-center">
        <ThemeToggler />
        {user ? (
          <>
            <NotificationBell />
            <div className="dropdown dropdown-end">
              <Avatar />
            </div>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `hidden md:inline-flex ${getBtnClass(isActive)}`
              }
            >
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `hidden md:inline-flex ${getBtnClass(isActive)}`
              }
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Registro
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

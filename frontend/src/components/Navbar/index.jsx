import { NavLink } from "react-router";
import Avatar from "@components/Avatar";
import ThemeToggler from "@components/ThemeToogler";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@context/AuthContext";
import nexhackLogo from "@assets/nexhack.png";
import nechackBlue from "@assets/nexhackBlue.png";

const Navbar = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const getBtnClass = (isActive) =>
    isActive
      ? `btn btn-sm ${isDark ? "btn-accent" : "btn-primary"}`
      : "btn btn-ghost btn-sm";

  return (
    <div className="navbar bg-base-300/30 shadow-sm sticky top-0 z-20 backdrop-blur-lg">
      <div className="navbar-start flex items-center gap-2">
        {/* Mobile Menu */}
        <div className="dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => getBtnClass(isActive)}
              >
                Inicio
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => getBtnClass(isActive)}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => getBtnClass(isActive)}
                  >
                    Perfil
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) => getBtnClass(isActive)}
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) => getBtnClass(isActive)}
                  >
                    Registro
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Logo */}
        <NavLink to="/" className="text-xl">
          <img
            src={isDark ? nexhackLogo : nechackBlue}
            alt="Nexhack"
            className="w-60 h-auto"
          />
        </NavLink>
      </div>

      {/* Navbar end */}
      <div className="navbar-end gap-2 items-center">
        <ThemeToggler />
        {user ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hidden md:inline-flex ${getBtnClass(isActive)}`
              }
            >
              Dashboard
            </NavLink>
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
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `hidden md:inline-flex ${getBtnClass(isActive)}`
              }
            >
              Registro
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

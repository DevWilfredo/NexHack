import { NavLink } from "react-router";
import Avatar from "../Avatar";
import ThemeToggler from "../ThemeToogler";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { isDark } = useTheme();

  const getBtnClass = (isActive) =>
    isActive
      ? `btn btn-sm ${isDark ? "btn-accent" : "btn-primary"}`
      : "btn btn-ghost btn-sm";

  return (
    <div className="navbar bg-base-300/30 shadow-sm sticky top-0 z-20 backdrop-blur-lg">
      <div className="navbar-start flex items-center gap-2">
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
            <li>
              <NavLink
                to="/desarrolladores"
                className={({ isActive }) => getBtnClass(isActive)}
              >
                Desarrolladores
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/colaboradores"
                className={({ isActive }) => getBtnClass(isActive)}
              >
                Colaboradores
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={({ isActive }) => getBtnClass(isActive)}
              >
                FAQ
              </NavLink>
            </li>
          </ul>
        </div>

        <a className="btn btn-ghost text-xl">NEXHACK</a>
      </div>

      {/* <div className="navbar-center hidden md:flex gap-2">
        <NavLink to="/" className={({ isActive }) => getBtnClass(isActive)}>
          Inicio
        </NavLink>
        <NavLink to="/desarrolladores" className={({ isActive }) => getBtnClass(isActive)}>
          Desarrolladores
        </NavLink>
        <NavLink to="/colaboradores" className={({ isActive }) => getBtnClass(isActive)}>
          Colaboradores
        </NavLink>
        <NavLink to="/faq" className={({ isActive }) => getBtnClass(isActive)}>
          FAQ
        </NavLink>
      </div> */}

      <div className="navbar-end gap-2 items-center">
        <ThemeToggler />
        <NavLink
          to="/login"
          className={({ isActive }) => getBtnClass(isActive)}
        >
          Login
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => getBtnClass(isActive)}
        >
          Dashboard
        </NavLink>
        <div className="dropdown dropdown-end">
          <Avatar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import { NavLink } from "react-router";
import Avatar from "@components/Avatar";
import ThemeToggler from "@components/ThemeToogler";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@context/AuthContext";
import nexhackLogo from "@assets/nexhack.png";
import nechackBlue from "@assets/nexhackBlue.png";
import { Menu } from "lucide-react";
import NotificationBell from "@components/NotificationBell";


const Navbar = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const getBtnClass = (isActive) =>
    isActive
      ? `btn btn-sm ${isDark ? "btn-accent" : "btn-primary"}`
      : "btn btn-ghost btn-sm";

  return (
    <div className={`navbar ${isDark ? 'bg-slate-900/80' : 'bg-base-300/30'} shadow-sm sticky top-0 z-20 backdrop-blur-lg`}>
      <div className="navbar-start flex items-center gap-2">
        {/* Mobile Menu */}
        <div className="dropdown md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <Menu className='space-5' />
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
            className="w-40 h-auto"
          />
        </NavLink>
      </div>

      {/* Navbar end */}
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

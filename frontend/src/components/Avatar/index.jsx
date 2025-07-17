import React from "react";
import { NavLink } from "react-router";

const Avatar = () => {
  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="http://localhost:5000/api/v1/users/profile_pictures/user_1.png"
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <NavLink to='/profile'>
            Perfil
          </NavLink>
        </li>
        <li>
          <a>Cerrar Sesion</a>
        </li>
      </ul>
    </div>
  );
};

export default Avatar;

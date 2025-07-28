import { NavLink } from "react-router";
import { useAuth } from "@context/AuthContext";

const Avatar = () => {
  const { logout, user } = useAuth();
  const firstLetter = user?.firstname?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="Avatar"
            src={
              user.profile_picture
                ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                    user.profile_picture
                  }`
                : `https://placehold.co/400x400?text=${firstLetter}`
            }
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to={`/profile/${user.id}`}>Perfil</NavLink>
        </li>
        <li onClick={handleLogout}>
          <a>Cerrar Sesión</a>
        </li>
      </ul>
    </div>
  );
};

export default Avatar;

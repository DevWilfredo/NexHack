import { NavLink } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import { Trophy } from "lucide-react";

const CardComponent = ({ userArray }) => {
  const { isDark } = useTheme();
  return (
    <div key={userArray.id} className="carousel-item w-1/2">
      <div
        className={`card card-side bg-base-200 shadow-xl/20 ${
          isDark ? "shadow-accent" : "shadow-primary"
        } border border-info/1 hover:scale-105 transition-all`}
      >
        <figure>
          <img
            src={
              userArray.profile_picture?.profile_picture
                ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                    userArray.profile_picture
                  }`
                : `https://placehold.co/400x400?text=${
                    userArray?.firstname?.charAt(0)?.toUpperCase() || "U"
                  }`
            }
            alt="Movie"
            className="w-50 h-full"
          />
        </figure>
        <div className="card-body  bg-base-300">
          <h2 className="card-title self-center">{userArray.firstname}</h2>
          <div className="flex gap-2 aling-items-center">
            <Trophy size={20} className="text-warning" />
            <h4 className="text-md">
              {userArray?.points || "Aqui van puntos"}
            </h4>
          </div>
          <p>{userArray.bio}</p>
          <div className="card-actions justify-end">
            <NavLink to={`/users/${userArray.id}`}>
              <button
                className={`btn btn-${
                  isDark ? "accent" : "primary"
                } hover:btn-info`}
              >
                See profile
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardComponent;

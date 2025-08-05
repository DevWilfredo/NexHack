import { UserPlus, X, Check } from "lucide-react";

import { NavLink } from "react-router";
import { useTheme } from "../../context/ThemeContext";

const UserToListcomponent = ({
  index,
  us,
  viewport = "invitacion",
  HandleInvitation,
  HandleAccept,
  HandleCancelInvitation,
}) => {
  const { isDark } = useTheme();
  return (
    <div
      key={index}
      className={`card bg-base-200 rounded-box p-3 mb-3 w-full md:w-[560px]
    shadow-md border-primary border shadow-primary
    hover:bg-primary hover:scale-[1.03] transition-all`}
    >
      <div className="flex justify-between ">
        <div className="flex items-center space-x-4">
          <img
            src={
              us.profile_picture
                ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                    us.profile_picture
                  }`
                : `https://placehold.co/400x400?text=${
                    us.firstname?.charAt(0)?.toUpperCase() || "U"
                  }`
            }
            className="w-8 h-8 rounded-full"
          />
          <p className="hover:text-info">
            <NavLink to={`/profile/${us.id}`} target="_blank">
              {us.firstname} {us.lastname}
            </NavLink>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mostrar botones según el contexto */}
          {viewport === "addMember" && (
            <button
              className="btn btn-sm btn-ghost hover:text-success hover:bg-transparent hover:border-transparent hover:shadow-none"
              onClick={() => HandleInvitation(us.id)}
            >
              <UserPlus />
            </button>
          )}

          {viewport === "solicitud" && (
            <>
              <button
                className="btn btn-sm btn-ghost hover:text-success hover:bg-transparent hover:border-transparent hover:shadow-none"
                onClick={() => HandleAccept("accept", index)}
              >
                <Check />
              </button>
              <button
                className="btn btn-sm btn-ghost hover:text-error hover:bg-transparent hover:border-transparent hover:shadow-none"
                onClick={() => HandleAccept("reject", index)}
              >
                <X />
              </button>
            </>
          )}
          {viewport === "invitacion" && HandleCancelInvitation && (
            <button
              className="btn btn-sm btn-ghost hover:text-error hover:bg-transparent hover:border-transparent hover:shadow-none"
              onClick={HandleCancelInvitation}
            >
              <X />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserToListcomponent;

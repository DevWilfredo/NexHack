import { Trophy, UserPlus } from "lucide-react";

import { NavLink } from "react-router";

function UserToJudgesComponent({ us, index, handleInvitation }) {
  return (
    <div
      key={index}
      className={` card card-xs bg-base-200 rounded-box p-3 mb-3 w-140         
           shadow-md border-primary border-1 shadow-primary   
           hover:bg-primary hover:scale-103 transition-all`}
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
          <label className="badge bg-primary">
            <Trophy className="text-warning" />
            {us.points ? us.points : 0}pts
          </label>
          <button
            className="btn btn-sm btn-ghost hover:text-success hover:bg-transparent hover:border-transparent hover:shadow-none"
            onClick={() => handleInvitation(us.id)}
          >
            <UserPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserToJudgesComponent;

import { useState } from "react";

function AvatarGroupComponent(team) {
  const [teams, setTeams] = useState(team.team);

  return (
    <div className="avatar-group -space-x-6 gap-3">
      {teams.slice(0, 3).map((member) => {
        const firstLetter =
          member.user.firstname?.charAt(0)?.toUpperCase() || "U";

        return (
          <div key={member.user.id} className="avatar">
            <div className="w-7">
              <img
                src={
                  member.user.profile_picture
                    ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                        member.user.profile_picture
                      }`
                    : `https://placehold.co/400x400?text=${firstLetter}`
                }
              />
            </div>
          </div>
        );
      })}

      {/* Placeholder solo si hay más de 3 */}
      {teams.length > 3 && (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-7 text-center ">
            <span className="text-xs">+{teams.length - 3}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarGroupComponent;

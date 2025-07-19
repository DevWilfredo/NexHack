import React from "react";

function AvatarGroupComponent(teams) {
  console.log(teams);
  return (
    <div className="avatar-group  -space-x-6  gap-3">
      {/* Mostrar hasta 3 avatares */}
      {teams.team.slice(0, 3).map((member) => (
        <div key={member.id} className="avatar">
          <div className="w-7">
            <img src={member.avatarUrl} />
          </div>
        </div>
      ))}

      {/* Placeholder solo si hay más de 3 */}
      {teams.team.length > 3 && (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-7 text-center ">
            <span className="text-xs">+{teams.team.length - 3}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarGroupComponent;

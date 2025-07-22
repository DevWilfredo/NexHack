import React, { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { getTeamByHackathon } from "../../services";
import { BriefcaseBusiness, Github } from "lucide-react";
import { formatDateToISOShort } from "../../utilities/dateUtils";
const team = {
  created_at: "2025-07-22T01:00:35.922881",
  creator_id: 1,
  creator_name: "John Doe",
  github_url: "https://github.com/user/project",
  hackathon: {
    id: 1,
    title: "New Hackathon",
    start_date: "2025-07-22T01:00:35.922881",
    end_date: "2025-07-22T01:00:35.922881",
    max_teams_member: 5,
  },

  id: 1,
  live_preview_url: "https://project.vercel.app",
  members: [
    {
      hackathon_id: 1,
      id: 1,
      joined_at: "2025-07-22T01:00:35.928538",
      team_id: 1,
      user_id: 1,
      avatar: null,
      name: "John Doe",
    },
    {
      hackathon_id: 1,
      id: 2,
      joined_at: "2025-07-22T01:00:35.928538",
      team_id: 1,
      user_id: 51,
      avatar: null,
      name: "Mike Doe",
    },
    {
      hackathon_id: 1,
      id: 3,
      joined_at: "2025-07-22T01:00:35.928538",
      team_id: 1,
      user_id: 3,
      avatar: null,
      name: "Celine Doe",
    },
    {
      hackathon_id: 1,
      id: 4,
      joined_at: "2025-07-22T01:00:35.928538",
      team_id: 1,
      user_id: 4,
      avatar: null,
      name: "Jane Doe",
    },
    {
      hackathon_id: 1,
      id: 5,
      joined_at: "2025-07-22T01:00:35.928538",
      team_id: 1,
      user_id: 5,
      avatar: null,
      name: "John Doe",
    },
  ],
  name: "Challenger",
  updated_at: "2025-07-22T01:00:35.922884",
  description: "Un proyecto que revoluciona el frontend moderno.",
};
function TeamsComponent({ hackathonId, teamId }) {
  const { user, userToken } = useAuth();
  const [teamData, setTeamData] = useState(team);

  // useEffect(() => {
  //   if (hackathonId && teamId && userToken) {
  //     console.log("Envio el token", userToken);
  //     getTeamByHackathon({
  //       teamId,
  //       hackathonId,
  //       token: userToken,
  //     })
  //       .then((data) => console.log(data))
  //       .catch((error) => console.error(error));
  //   }
  // }, []);

  console.log(user);
  return (
    <div className="bg-base-200 rounded-xl p-6 shadow-lg w-full max-w-5xl mx-auto space-y-6">
      {/* Título y hackathon */}
      <div className="flex justify-between items-start md:items-center">
        {/* Nombre + Creador + Botón */}
        <div>
          <div className="flex items-center gap-4 flex-wrap align-baseline">
            <h1 className="text-2xl font-bold">{teamData.name}</h1>
            {user.id === teamData.creator_id ? (
              <button className="btn btn-warning btn-ghost hover:btn-success btn-outline">
                Editar equipo
              </button>
            ) : (
              ""
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Creador: {teamData.creator_name}
          </p>
        </div>

        {/* Info del hackathon */}
        <div className="text-right">
          <span className="badge badge-primary p-3 text-sm">
            {teamData.hackathon.title}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            {`Fechas: ${formatDateToISOShort(
              teamData.hackathon.start_date
            )} - ${formatDateToISOShort(teamData.hackathon.end_date)}`}
          </p>
        </div>
      </div>

      {/* Bento Section: Enlaces (1/3) + Info (2/3) */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Izquierda: Enlaces - 1/3 */}
        <div className="md:w-1/3 w-full">
          <div className="card bg-neutral text-neutral-content p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">Enlaces del Proyecto</h2>
            <div className="mb-4 flex">
              <label className="label font-semibold ">
                <Github />
              </label>
              <a
                href={teamData.github_url}
                className="text-secondary font-bold ms-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {teamData.github_url || "No proporcionado"}
              </a>
            </div>
            <div className="flex mb-4">
              <label className="label font-semibold">
                <BriefcaseBusiness />
              </label>
              <a
                href={teamData.live_preview_url}
                className=" text-secondary font-bold  ms-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {teamData.live_preview_url || "No proporcionado"}
              </a>
            </div>
          </div>
        </div>

        {/* Derecha: Miembros + Descripción - 2/3 */}
        <div className="md:w-2/3 w-full space-y-4">
          {/* Miembros */}
          <div className="card bg-neutral text-neutral-content p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Miembros del equipo</h2>
              <h2 className="text-lg font-semibold">{`${teamData.members.length} / ${teamData.hackathon.max_teams_member}`}</h2>
            </div>
            <div className="overflow-x-auto flex gap-4 justify-center">
              {teamData.members.map((member, idx) => (
                <img
                  key={idx}
                  src={
                    member.avatar
                      ? `${
                          import.meta.env.VITE_API_URL
                        }/users/profile_pictures/${member.avatar}`
                      : `https://placehold.co/400x400?text=${
                          member.name?.charAt(0)?.toUpperCase() || "U"
                        }`
                  }
                  alt={member.name}
                  className="w-20 h-20 rounded-full shadow-md"
                  title={member.name}
                />
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="card bg-neutral text-neutral-content p-4">
            <h2 className="font-semibold">Descripción del Proyecto</h2>
            <p className="p-4 rounded-lg shadow-inner">
              {teamData.description ||
                "Este equipo aún no ha definido una descripción del proyecto."}
            </p>
          </div>
        </div>
      </div>

      {/* Botón para solicitar unirse */}
      <div className="flex justify-end text-center pt-4">
        {teamData.members.some((member) => member.user_id === user.id) ? (
          <button className="btn btn-disabled">Eres miembro</button>
        ) : teamData.members.length >= teamData.hackathon.max_teams_member ? (
          <button className="btn btn-disabled">Equipo lleno</button>
        ) : (
          <button className="btn btn-primary hover:btn-success">
            Solicitar unirme
          </button>
        )}
      </div>
    </div>
  );
}

export default TeamsComponent;

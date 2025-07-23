import React, { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { fetchSingleHackathon, getTeamByHackathon } from "../../services";
import { BriefcaseBusiness, Github } from "lucide-react";
import { formatDateToISOShort } from "../../utilities/dateUtils";
import AddMemberModal from "../TeamsModal";
import { useTheme } from "../../context/ThemeContext";

function TeamsComponent({ hackathonId, teamId }) {
  const { user, userToken } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [hackathonData, setHackathonData] = useState(null);
  const [activeSection, setActiveSection] = useState("miembros"); //
  const [activeModal, setActiveModal] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (hackathonId && teamId && userToken) {
      fetchSingleHackathon(hackathonId, userToken)
        .then((data) => {
          setHackathonData(data);
        })
        .catch((error) => console.error("Error fetching hackathon:", error));

      getTeamByHackathon({ teamId, hackathonId, token: userToken })
        .then((res) => {
          setTeamData(res);
        })
        .catch((error) => console.error("Error fetching team:", error));
    }
  }, [hackathonId, teamId, userToken]);

  const refreshTeamData = () => {
    if (hackathonId && teamId && userToken) {
      getTeamByHackathon({ teamId, hackathonId, token: userToken })
        .then((res) => {
          setTeamData(res);
        })
        .catch((error) => console.error("Error fetching team:", error));
    }
  };

  if (!user || !teamData || !hackathonData) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  const isMember = teamData.members.some((m) => m.user?.id === user.id);
  const isFull = teamData.members.length >= hackathonData.max_team_members;

  const creatorName =
    teamData.members.find((member) => member.user?.id === teamData.creator_id)
      ?.user.firstname +
      " " +
      teamData.members.find((member) => member.user?.id === teamData.creator_id)
        ?.user.lastname || "Desconocido";

  return (
    <div
      className={`rounded-xl p-6 w-full mx-auto space-y-6 bg-base-200 shadow-xl/20 ${
        isDark ? "shadow-accent" : "shadow-primary"
      } border border-info/10`}
    >
      {/* Título y hackathon */}
      <div className="flex justify-between items-start md:items-center">
        <div>
          <div className="flex items-center gap-4 flex-wrap align-baseline">
            <h1 className="text-3xl font-bold">{teamData.name}</h1>
            {user.id === teamData.creator_id && (
              <label
                htmlFor="addMemberModal"
                className={`btn hover:btn-success  ${
                  isDark ? "btn-accent" : "btn-primary"
                }`}
                onClick={() => setActiveModal("EditingTeam")}
              >
                Editar equipo
              </label>
            )}
          </div>
          <p className="text-md text-gray-500 mt-1">Creador: {creatorName}</p>
        </div>

        <div className="text-right">
          <span className="badge badge-primary p-3 text-lg">
            {hackathonData.title}
          </span>
          <p className="text-md text-gray-500 mt-1">
            {`Fechas: ${formatDateToISOShort(
              hackathonData.start_date
            )} - ${formatDateToISOShort(hackathonData.end_date)}`}
          </p>
        </div>
      </div>

      {/* Bento Section: Enlaces + Info */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Izquierda: Enlaces */}
        <div className="md:w-1/3 w-full">
          <div className="card bg-neutral text-neutral-content p-4 h-full">
            <h2 className="text-xl font-semibold mb-4">Enlaces del Proyecto</h2>

            <div className="mb-4 flex items-center">
              <Github className="w-5 h-5" />
              <a
                href={teamData.github_url}
                className={`${
                  isDark ? "text-accent" : "text-primary"
                } font-bold ms-2 break-all`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {teamData.github_url || "No proporcionado"}
              </a>
            </div>

            <div className="flex items-center">
              <BriefcaseBusiness className="w-5 h-5" />
              <a
                href={teamData.live_preview_url}
                className={`${
                  isDark ? "text-accent" : "text-primary"
                } font-bold ms-2 break-all`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {teamData.live_preview_url || "No proporcionado"}
              </a>
            </div>
          </div>
        </div>

        {/* Derecha: Tabs + miembros o solicitudes + descripción */}
        <div className="md:w-2/3 w-full space-y-3">
          <div className="">
            {user.id === teamData.creator_id && (
              <div className="tabs tabs-lift ms-1">
                <input
                  type="radio"
                  name={`team_tabs_${teamId}`}
                  className="tab"
                  aria-label="Miembros"
                  checked={activeSection === "miembros"}
                  onChange={() => setActiveSection("miembros")}
                />
                <input
                  type="radio"
                  name={`team_tabs_${teamId}`}
                  className="tab"
                  aria-label="Solicitudes"
                  checked={activeSection === "solicitudes"}
                  onChange={() => setActiveSection("solicitudes")}
                />
              </div>
            )}
            {activeSection === "miembros" ? (
              <div className="card bg-neutral text-neutral-content  p-4">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <div className=" flex gap-2 align-baseline ">
                    <h2 className="text-lg font-semibold">
                      Miembros del equipo
                    </h2>
                    {user.id === teamData.creator_id && (
                      <label
                        onClick={() => setActiveModal("AddingMembers")}
                        htmlFor="addMemberModal"
                        className={`btn btn-sm ${
                          isDark ? "btn-accent" : "btn-primary"
                        }   hover:btn-success ${isFull ? "btn-disabled" : ""}`}
                      >
                        Agregar miembros
                      </label>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {`${teamData.members.length} / ${hackathonData.max_team_members}`}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto flex gap-4 justify-center">
                  {teamData.members.map((member, idx) => (
                    <img
                      key={idx}
                      src={
                        member.user?.profile_picture
                          ? `${
                              import.meta.env.VITE_API_URL
                            }/users/profile_pictures/${
                              member.user.profile_picture
                            }`
                          : `https://placehold.co/400x400?text=${
                              member.user?.firstname
                                ?.charAt(0)
                                ?.toUpperCase() || "U"
                            }`
                      }
                      alt={member.user?.firstname || "User"}
                      className="w-20 h-20 rounded-full shadow-md"
                      title={member.user?.firstname}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card bg-neutral text-neutral-content p-4">
                <h2 className="text-lg font-semibold mb-2">Solicitudes</h2>
                {/* Aquí puedes conectar solicitudes reales */}
                <p className="p-4 rounded-lg shadow-inner">
                  No hay solicitudes por el momento.
                </p>
              </div>
            )}
          </div>
          <AddMemberModal
            team={teamData}
            toState={activeModal}
            onTeamUpdated={refreshTeamData}
          />

          {/* Descripción del Proyecto */}
          <div className="card bg-neutral text-neutral-content p-4">
            <h2 className="font-semibold mb-2">Descripción del Proyecto</h2>
            <p className="p-4 rounded-lg shadow-inner">
              {teamData.bio ||
                "Este equipo aún no ha definido una descripción del proyecto."}
            </p>
          </div>
        </div>
      </div>

      {/* Botón para unirse */}
      <div className="flex justify-end pt-4">
        {isMember ? (
          <button className="btn btn-disabled">Eres miembro</button>
        ) : isFull ? (
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

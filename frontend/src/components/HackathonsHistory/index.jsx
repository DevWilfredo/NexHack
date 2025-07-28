import React, { useMemo } from "react";
import { ExternalLink, Rocket, Github, CalendarDays } from "lucide-react";
import { useAuth } from "@context/AuthContext";

function HackathonHistory({ hackathons = [], search, setSearch }) {
  const { user } = useAuth();

  const filteredHackathons = useMemo(() => {
    if (!search) return hackathons;

    return hackathons.filter((hack) => {
      const title = hack.title?.toLowerCase() || "";
      const team = hack.teams?.find((team) =>
        team.members?.some((m) => m.user?.id === user?.id)
      );
      const teamName = team?.name?.toLowerCase() || "";
      const query = search.toLowerCase();

      return title.includes(query) || teamName.includes(query);
    });
  }, [search, hackathons, user]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por hackathon o equipo..."
          className="input bg-base-200 w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredHackathons.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground italic">
          No se encontraron hackathons con ese criterio.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6">
          {filteredHackathons.map((hack, index) => {
            // Encuentra el equipo del usuario actual
            const userTeam = hack.teams?.find((team) =>
              team.members?.some((m) => m.user?.id === user?.id)
            );

            return (
              <li
                key={index}
                className="rounded-xl bg-base-200 p-4 shadow-lg/30 shadow-primary hover:scale-[1.02] transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">
                    {hack.title || "Hackathon sin título"}
                  </h3>
                  <span
                    className={`badge text-sm ${
                      hack.role === "creator"
                        ? "badge-info"
                        : hack.role === "judge"
                        ? "badge-warning"
                        : hack.role === "participant"
                        ? "badge-primary"
                        : "badge-ghost"
                    }`}
                  >
                    {hack.role === "creator"
                      ? "Creador"
                      : hack.role === "judge"
                      ? "Juez"
                      : hack.role === "participant"
                      ? "Participante"
                      : "Sin rol"}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-2">
                  <span className="font-semibold">Equipo:</span>{" "}
                  {userTeam?.name || "Sin equipo asignado"}
                </p>

                <p className="text-sm mb-2">
                  {hack.description || "Sin descripción disponible."}
                </p>

                <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                  <CalendarDays />
                  {hack.end_date
                    ? new Date(hack.end_date).toLocaleDateString()
                    : "Fecha no disponible"}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {userTeam?.github_url ? (
                    <a
                      href={userTeam.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm border border-gray-600"
                    >
                      <Github size={16} /> Proyecto
                    </a>
                  ) : (
                    <span className="btn btn-sm btn-disabled">
                      <Github size={16} /> Sin GitHub
                    </span>
                  )}

                  {userTeam?.live_preview_url ? (
                    <a
                      href={userTeam.live_preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      <Rocket size={16} /> Deploy
                    </a>
                  ) : (
                    <span className="btn btn-sm btn-disabled">
                      <Rocket size={16} /> Sin Deploy
                    </span>
                  )}

                  {hack.link ? (
                    <a
                      href={hack.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-info text-gray-700"
                    >
                      <ExternalLink size={16} /> Hackathon
                    </a>
                  ) : (
                    <span className="btn btn-sm btn-disabled">
                      <ExternalLink size={16} /> No disponible
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default HackathonHistory;

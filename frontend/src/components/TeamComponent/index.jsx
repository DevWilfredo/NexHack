import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { fetchSingleHackathon, getTeamByHackathon } from "../../services";
import { BriefcaseBusiness, Github } from "lucide-react";
import { formatDateToISOShort } from "../../utilities/dateUtils";
import AddMemberModal from "../TeamsModal";
import { useTheme } from "../../context/ThemeContext";
import UserToListcomponent from "../UserToList";
import CardCarousel from "../Carrousel";
import SearchBar from "../searchBar";
import {
  AcceptorReject,
  HandleCancelInvitation,
  JoinTeam,
  refreshTeamData,
} from "../../utilities/userUtils";

function TeamsComponent({ hackathonId, teamId }) {
  const { user, userToken } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [hackathonData, setHackathonData] = useState(null);
  const [activeSection, setActiveSection] = useState("miembros"); //
  const [activeModal, setActiveModal] = useState(null);
  const { isDark } = useTheme();
  const [disabledButton, setDisabledButton] = useState({
    disable: false,
    message: "Solicitar unirse",
  });

  //filtro de solicitudes  y searchbar
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [invitacionesPendientes, setInvitacionesPendientes] = useState([]);
  const [tipoSolicitudActivo, setTipoSolicitudActivo] = useState("solicitudes");
  const [filtro, setFiltro] = useState("");

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

  //useEffect para solicitudes
  useEffect(() => {
    if (teamData) {
      const solicitudes = teamData.requests.filter(
        (req) => req.type === "application" && req.status === "pending"
      );
      const invitaciones = teamData.requests.filter(
        (req) => req.type === "invitation" && req.status === "pending"
      );
      setSolicitudesPendientes(solicitudes);
      setInvitacionesPendientes(invitaciones);
    }
  }, [teamData]);

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
  //Eliminar invitaciones

  //verificar Si tienes solicitud Pendiente
  const hasPendingRequest = teamData.requests.some(
    (req) =>
      req.type === "application" &&
      req.status === "pending" &&
      req.user.id === user.id
  );
  //estas dentro de un hackathon?
  const isInHackathon = hackathonData.teams.some((teams) =>
    teams.members.some((member) => member.id === user.id)
  );
  //sacamos del array de array de array a los usuarios y lo enviamos al carrousel
  const teamMembers = teamData?.members.map((member) => member.user) || [];

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
          <span
            className={`p-3 text-lg ${
              isDark ? "badge badge-accent" : "badge badge-primary "
            }`}
          >
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
          <div className="card bg-base-300 text-neutral-content p-4 h-full">
            <div className=" mb-8">
              <h2 className="text-xl font-semibold border-b-2 mb-2">
                Descripción del Proyecto
              </h2>
              <p className="p-4 rounded-lg shadow-inner">
                {teamData.bio ||
                  "Este equipo aún no ha definido una descripción del proyecto."}
              </p>
            </div>
            <h2 className="text-xl font-semibold  border-b-2 mt-5 mb-4">
              Enlaces del Proyecto
            </h2>

            <div className="mb-4 flex mt- items-center">
              <Github className="w-8 h-8" />
              <a
                href={`https://${teamData.github_url}`}
                className={`${
                  isDark ? "text-accent" : "text-primary"
                } font-bold  text-lg ms-2 break-all hover:text-info`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {teamData.github_url || "No proporcionado"}
              </a>
            </div>

            <div className="flex items-center">
              <BriefcaseBusiness className="w-8 h-8" />
              <a
                href={`https://${teamData.live_preview_url}`}
                className={`${
                  isDark ? "text-accent" : "text-primary"
                } font-bold text-lg ms-2 break-all hover:text-info`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {teamData.live_preview_url || "No proporcionado"}
              </a>
            </div>
          </div>
        </div>

        {/* Derecha: Tabs + miembros o solicitudes + descripción */}
        <div className="md:w-2/3 w-full  space-y-3">
          <div className=" ">
            {user.id === teamData.creator_id && (
              <div className="tabs tabs-lift ms-1">
                <input
                  type="radio"
                  name={`team_tabs_${teamId}`}
                  className={`tab ${
                    activeSection === "miembros" ? "bg-base-300" : "bg-base-200"
                  }`}
                  aria-label="Miembros"
                  checked={activeSection === "miembros"}
                  onChange={() => setActiveSection("miembros")}
                />
                <input
                  type="radio"
                  name={`team_tabs_${teamId}`}
                  className={`tab ${
                    activeSection === "solicitudes"
                      ? "bg-base-300"
                      : "bg-base-200"
                  }`}
                  aria-label="Solicitudes"
                  checked={activeSection === "solicitudes"}
                  onChange={() => setActiveSection("solicitudes")}
                />
              </div>
            )}
            {activeSection === "miembros" ? (
              <div className="card bg-base-300 text-neutral-content  p-4">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <div className=" flex gap-2 align-baseline ">
                    <h2 className="text-xl font-semibold">
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

                <div className="">
                  <CardCarousel
                    usersArray={teamMembers}
                    initialSlide={0}
                    cardsPerSlide={2}
                  />
                </div>
              </div>
            ) : (
              <div className="card bg-base-300 text-neutral-content p-4 ">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold mb-4">Solicitudes</h2>

                  {/* Tabs internas */}
                  <div className="tabs tabs-boxed mb-4 ">
                    <div className="flex gap-2 mb-4 mr-2 items-center pb-2 ">
                      <button
                        className={`btn btn-xs rounded-full  ${
                          tipoSolicitudActivo === "solicitudes"
                            ? isDark
                              ? "btn-accent"
                              : "btn-primary"
                            : "btn-outline"
                        } hover:scale-103 transition-all`}
                        onClick={() => setTipoSolicitudActivo("solicitudes")}
                      >
                        Solicitudes
                      </button>

                      <button
                        className={`btn btn-xs rounded-full  ${
                          tipoSolicitudActivo === "invitaciones"
                            ? isDark
                              ? "btn-accent"
                              : "btn-primary"
                            : "btn-outline"
                        } hover:scale-103 transition-all`}
                        onClick={() => setTipoSolicitudActivo("invitaciones")}
                      >
                        Invitaciones
                      </button>
                    </div>

                    <div className="mb-4">
                      <SearchBar
                        onSearch={setFiltro}
                        placeholder="Buscar"
                        spacing="xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Lista filtrada */}
                <div className="overflow-y-auto max-h-60 ps-6">
                  {(tipoSolicitudActivo === "solicitudes"
                    ? solicitudesPendientes
                    : invitacionesPendientes
                  )
                    .filter((req) => {
                      const nombreCompleto =
                        `${req.user.firstname} ${req.user.lastname}`.toLowerCase();
                      return nombreCompleto.includes(filtro.toLowerCase());
                    })
                    .map((request) => {
                      // mapeamos el cancelar aca para que se actualice el estado del padre y sepa que ID hay que borrar
                      const cancelarInvitacion = HandleCancelInvitation(
                        userToken,
                        hackathonId,
                        teamId,
                        setTeamData
                      );

                      return (
                        <UserToListcomponent
                          key={request.id}
                          index={request.id}
                          us={request.user}
                          viewport={
                            tipoSolicitudActivo === "solicitudes"
                              ? "solicitud"
                              : "invitacion"
                          }
                          HandleAccept={
                            tipoSolicitudActivo === "solicitudes"
                              ? AcceptorReject(userToken, refreshTeamData)
                              : undefined
                          }
                          HandleCancelInvitation={
                            tipoSolicitudActivo === "invitaciones"
                              ? () => cancelarInvitacion(request.id)
                              : undefined
                          }
                        />
                      );
                    })}

                  {/* Si no hay resultados */}
                  {(tipoSolicitudActivo === "solicitudes"
                    ? solicitudesPendientes
                    : invitacionesPendientes
                  ).filter((req) => {
                    const nombreCompleto =
                      `${req.user.firstname} ${req.user.lastname}`.toLowerCase();
                    return nombreCompleto.includes(filtro.toLowerCase());
                  }).length === 0 && (
                    <p className="text-center text-sm text-gray-400 mt-2">
                      No hay {tipoSolicitudActivo} pendientes.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón para unirse */}
      <div className="flex justify-end pt-4">
        {isMember ? (
          <button className="btn btn-disabled">Eres miembro</button>
        ) : isFull ? (
          <button className="btn btn-disabled">Equipo lleno</button>
        ) : hasPendingRequest ? (
          <button className="btn btn-disabled">Esperando respuesta</button>
        ) : isInHackathon ? (
          <button className="btn btn-disabled">Inscrito en otro equipo</button>
        ) : (
          <button
            disabled={disabledButton.disable}
            className={`btn ${
              isDark ? "btn-accent" : "btn-primary"
            } hover:btn-success`}
            onClick={JoinTeam(userToken, teamId, setDisabledButton)}
          >
            {disabledButton.message || "Unirse al equipo"}
          </button>
        )}
      </div>
      <AddMemberModal
        team={teamData}
        toState={activeModal}
        onTeamUpdated={refreshTeamData(
          hackathonId,
          teamId,
          userToken,
          setTeamData
        )}
      />
    </div>
  );
}

export default TeamsComponent;

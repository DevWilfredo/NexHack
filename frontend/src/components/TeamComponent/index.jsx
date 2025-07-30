import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import {
  fetchSingleHackathon,
  getTeamByHackathon,
  GetTeamScore,
  HandleInvitation,
} from "../../services";
import {
  BookOpen,
  BriefcaseBusiness,
  ExternalLink,
  Frown,
  Github,
  MessageSquareText,
  UserPlus,
  Users,
  UsersRound,
} from "lucide-react";
import { formatDateToISOShort } from "../../utilities/dateUtils";
import AddMemberModal from "../TeamsModal";
import { useTheme } from "../../context/ThemeContext";
import UserToListcomponent from "../UserToList";
import CardCarousel from "../Carrousel";
import SearchBar from "../searchBar";
import {
  HandleCancelInvitation,
  isInHackathon,
  JoinTeam,
} from "../../utilities/userUtils";
import toast from "react-hot-toast";
import { useApp } from "@context/AppContext";
import { NavLink } from "react-router";
import TestimonialCarousel from "../TestimonialCarrousel";
import EvaluationModalComponent from "../EvaluationModal";

function TeamsComponent({ hackathonId, teamId }) {
  const { user, userToken } = useAuth();
  const [teamData, setTeamData] = useState(null);
  const [hackathonData, setHackathonData] = useState(null);
  const [activeSection, setActiveSection] = useState("miembros"); //
  const [activeModal, setActiveModal] = useState(null);
  const { isDark } = useTheme();
  const { fetchRequests, allhackathons, allScores, requests } = useApp();
  const [disabledButton, setDisabledButton] = useState({
    disable: false,
    message: "Solicitar unirse",
  });

  //filtro de solicitudes  y searchbar
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [invitacionesPendientes, setInvitacionesPendientes] = useState([]);
  const [tipoSolicitudActivo, setTipoSolicitudActivo] = useState("solicitudes");
  const [filtro, setFiltro] = useState("");

  //modal de evaluacion
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [scores, setTeamScores] = useState([]);
  const [judgeReviews, setJudgeReviews] = useState([]);
  const [isAJudge, setIsAJudge] = useState(false);
  const handleShowEvaluationModal = () => {
    setShowEvaluationModal((prev) => !prev);
  };

  useEffect(() => {
    if (hackathonId && teamId && userToken) {
      fetchSingleHackathon(hackathonId, userToken)
        .then((data) => {
          setHackathonData(data);
          setIsAJudge(data.judges.some((judge) => judge.id === user.id));
        })
        .catch((error) => console.error("Error fetching hackathon:", error));

      getTeamByHackathon({ teamId, hackathonId, token: userToken })
        .then((res) => {
          setTeamData(res);
        })
        .catch((error) => console.error("Error fetching team:", error));
    }
  }, [hackathonId, teamId, userToken, allhackathons, allScores]);

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

  //Esto trae jueces, no scores ya hechos. OJO
  useEffect(() => {
    if (teamId && userToken) {
      GetTeamScore(teamId, userToken)
        .then((score) => {
          setTeamScores(score);
        })
        .catch((err) => console.error("Error fetching team scores:", err));
    }
  }, [teamId, userToken, allScores]);

  //Este si filtra que jueces ya evaluaron y saca a los que no de la lista
  useEffect(() => {
    if (hackathonData && scores.length > 0) {
      const reviews = hackathonData.judges
        .filter((judge) => scores.some((score) => score.judge_id === judge.id))
        .map((judge) => {
          const review = scores.find((score) => score.judge_id === judge.id);
          return {
            judge,
            score: review?.score ?? null,
            comment: review?.feedback ?? null,
          };
        });

      setJudgeReviews(reviews);
    }
  }, [scores, hackathonData, allScores]);
  //Verificador si ya voto, no pueda usar el boton
  const hasVoted = judgeReviews.some((review) => {
    const match = review.judge.id === user.id;

    return match;
  });

  if (!user || !teamData || !hackathonData) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  const isMember = teamData.members.some((m) => m.user?.id === user.id);
  const isFull = teamData.members.length >= hackathonData.max_team_members;
  const PendingInv = requests.some(
    (req) =>
      req.status === "pending" &&
      req.type === "invitation" &&
      req.team_id === teamData.id
  );

  const creatorName =
    teamData.members.find((member) => member.user?.id === teamData.creator_id)
      ?.user.firstname +
      " " +
      teamData.members.find((member) => member.user?.id === teamData.creator_id)
        ?.user.lastname || "Desconocido";

  //verificar Si tienes solicitud Pendiente
  const hasPendingRequest = teamData.requests.some(
    (req) =>
      req.type === "application" &&
      req.status === "pending" &&
      req.requested_by.id === user.id
  );
  //copia de refreshData
  function refreshTeamData() {
    if (hackathonId && teamId && userToken) {
      getTeamByHackathon({ teamId, hackathonId, token: userToken })
        .then((res) => {
          setTeamData(res);
          fetchRequests();
        })
        .catch((error) =>
          console.error("Error al obtener datos del equipo:", error)
        );
    }
  }

  //copia del services
  function AcceptorReject(userToken) {
    return (action, requestID) => {
      HandleInvitation(userToken, requestID, action)
        .then(() => {
          refreshTeamData(); // ahora está disponible correctamente
          if (action.trim().toLowerCase() === "accept") {
            toast.success("Invitación aceptada");
          } else {
            toast.error("Invitación rechazada");
          }
        })
        .catch((error) => {
          toast.error("Error al procesar la solicitud");
          console.error("Error en AcceptorReject:", error);
        });
    };
  }

  //sacamos del array de array de array a los usuarios y lo enviamos al carrousel
  const teamMembers = teamData?.members.map((member) => member.user) || [];
  //info que debe esperar al useEffect
  const actualStatus = hackathonData.status;

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
            <h1 className="text-3xl font-bold card-title">
              <UsersRound /> {teamData.name}
            </h1>
            {actualStatus === "cancelled" || actualStatus === "finished"
              ? ""
              : user.id === teamData.creator_id && (
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
            <p className="card-title">{hackathonData.title}</p>
          </span>
          <p className="text-md text-gray-500 mt-1">
            {`Fechas: ${formatDateToISOShort(
              hackathonData.start_date
            )} - ${formatDateToISOShort(hackathonData.end_date)}`}
          </p>
          {actualStatus === "cancelled" || actualStatus === "finished" ? (
            ""
          ) : isAJudge ? (
            <button
              onClick={handleShowEvaluationModal}
              className={`btn ${
                hasVoted ? "btn-disabled" : "btn-primary"
              } mt-2`}
              disabled={hasVoted}
            >
              {hasVoted ? "Ya evaluaste" : "Evaluar Equipo"}
            </button>
          ) : (
            ""
          )}
          <EvaluationModalComponent
            showModal={showEvaluationModal}
            onClose={handleShowEvaluationModal}
            team={teamData}
          />
        </div>
      </div>

      {/* Bento Section: Enlaces + Info */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Izquierda: Enlaces */}
        <div className="md:w-1/3 w-full">
          <div className="card bg-base-300 text-neutral-content p-4 h-full">
            <div className=" mb-8">
              <h2 className="text-xl font-semibold card-title border-b-2 mb-2">
                <BookOpen />
                Descripción del Proyecto
              </h2>
              <p className="p-4 rounded-lg shadow-inner">
                {teamData.bio ||
                  "Este equipo aún no ha definido una descripción del proyecto."}
              </p>
            </div>
            <h2 className="text-xl font-semibold card-title border-b-2 mt-5 mb-4">
              <ExternalLink /> Enlaces del Proyecto
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
            {actualStatus === "cancelled" || actualStatus === "finished"
              ? ""
              : user.id === teamData.creator_id && (
                  <div className="tabs tabs-lift ms-1">
                    <input
                      type="radio"
                      name={`team_tabs_${teamId}`}
                      className={`tab ${
                        activeSection === "miembros"
                          ? "bg-base-300"
                          : "bg-base-200"
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
                    <h2 className="text-xl font-semibold card-title">
                      <Users /> Miembros del equipo
                    </h2>
                    {actualStatus === "cancelled" || actualStatus === "finished"
                      ? ""
                      : user.id === teamData.creator_id && (
                          <label
                            onClick={() => setActiveModal("AddingMembers")}
                            htmlFor="addMemberModal"
                            className={`btn btn-sm card-title${
                              isDark ? "btn-accent" : "btn-primary"
                            }   hover:btn-success ${
                              isFull ? "btn-disabled" : ""
                            }`}
                          >
                            <UserPlus /> Agregar miembros
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
                    viewport="small"
                    hackathonStatus={hackathonData.status}
                    teamData={teamData}
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
                  {(() => {
                    const listaPendiente =
                      tipoSolicitudActivo === "solicitudes"
                        ? solicitudesPendientes
                        : invitacionesPendientes;

                    const getNombreCompleto = (req) => {
                      const persona =
                        tipoSolicitudActivo === "solicitudes"
                          ? req.requested_by
                          : req.user;
                      return `${persona.firstname} ${persona.lastname}`.toLowerCase();
                    };

                    const listaFiltrada = listaPendiente.filter((req) =>
                      getNombreCompleto(req).includes(filtro.toLowerCase())
                    );

                    return (
                      <>
                        {listaFiltrada.map((request) => (
                          <UserToListcomponent
                            key={request.id}
                            index={request.id}
                            us={
                              tipoSolicitudActivo === "solicitudes"
                                ? request.requested_by
                                : request.user
                            }
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
                                ? () =>
                                    HandleCancelInvitation(
                                      userToken,
                                      refreshTeamData
                                    )(request.id)
                                : undefined
                            }
                          />
                        ))}

                        {listaFiltrada.length === 0 && (
                          <div className="flex flex-col items-center justify-center text-gray-400 mt-4 space-y-2">
                            <Frown className="w-6 h-6" />
                            <p className="text-sm text-center">
                              {filtro.trim() !== ""
                                ? "No se ha encontrado al usuario :("
                                : `No hay ${tipoSolicitudActivo} pendientes.`}
                            </p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full card bg-base-300 text-neutral-content p-4 p">
        <div>
          <h2 className="text-bold text-xl card-title">
            <MessageSquareText />
            Valoraciones del Jurado
          </h2>
        </div>
        <div className="divider pt-0" />
        {judgeReviews && hackathonData.status === "finished" ? (
          <div>
            <TestimonialCarousel
              testimonials={judgeReviews ? judgeReviews : []}
              cardsPerSlide={3}
            />
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 mt-2">
            No hay valoraciones publicadas aun....
          </p>
        )}
      </div>

      {/* Botón para unirse */}
      <div className="flex justify-between">
        <div className="flex justify-start pt-4">
          <NavLink to={`/hackathons/${hackathonData.id}`}>
            {" "}
            <button className="btn btn-primary">volver atras</button>
          </NavLink>
        </div>
        <div className="flex justify-end pt-4">
          {actualStatus === "cancelled" ? (
            <button className="btn btn-disabled">Evento cancelado</button>
          ) : actualStatus === "finished" ? (
            <button className="btn btn-disabled">Evento finalizado</button>
          ) : hackathonData.judges.some((j) => j.id === user.id) ? (
            <button className="btn btn-disabled">
              Eres juez en este evento
            </button>
          ) : isMember ? (
            <button className="btn btn-disabled">Eres miembro</button>
          ) : isFull ? (
            <button className="btn btn-disabled">Equipo lleno</button>
          ) : hasPendingRequest ? (
            <button className="btn btn-disabled">Esperando respuesta</button>
          ) : PendingInv ? (
            <button className="btn btn-disabled">
              Tienes una invitacion pendiente
            </button>
          ) : isInHackathon(hackathonData, user) ? (
            <button className="btn btn-disabled">
              Inscrito en otro equipo
            </button>
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
      </div>
      <AddMemberModal
        team={teamData}
        toState={activeModal}
        onTeamUpdated={refreshTeamData}
      />
    </div>
  );
}

export default TeamsComponent;

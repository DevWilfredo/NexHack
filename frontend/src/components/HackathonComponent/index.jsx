import { Navigate, NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import AvatarGroupComponent from "../../components/AvatarGroup";
import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { formatDateToISOShort } from "../../utilities/dateUtils";
import { fetchSingleHackathon, GetTags } from "../../services";
import CardCarousel from "../Carrousel";
import CreateTeamModal from "../CreateTeamModal";
import { isInHackathon } from "../../utilities/userUtils";
import {
  AlertCircle,
  CalendarIcon,
  Frown,
  Scale,
  Trophy,
  User,
  Users,
} from "lucide-react";
import DynamicIcon from "../DynamicIcon";
import BadgeHackathonComponent from "../BadgeHackathon";
import { useApp } from "../../context/AppContext";
import EditHackathonModal from "../EditHackathonModal";
import JudgesModalComponent from "../JudgesModal";
import WarningModalComponent from "../warningmodal";
const HackatonsComponent = ({ hackathonId }) => {
  const { user, userToken } = useAuth();
  const [equipos, setEquipos] = useState([]);
  const {
    globalUsers,
    allHackathons,
    loadingAllHackathons,
    allScores,
    allWinners,
  } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [dbTags, setDbTagas] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState("");
  const [hackathon, setHackathon] = useState(null);

  const handleWarningModal = (type) => {
    setShowWarningModal(type);

    document.activeElement?.blur();
    document.getElementById("warningmodal")?.showModal();
  };

  const handleModal = () => setShowModal((prev) => !prev);
  const updateData = async () => {
    hackathon = allHackathons.find((h) => h.id === hackathonId);
    setEquipos(hackathon.teams);
    GetTags().then((data) => setDbTagas(data));
  };

  useEffect(() => {
    if (!loadingAllHackathons) {
      const found = allHackathons.find(
        (h) => String(h.id) === String(hackathonId)
      );
      setHackathon(found || null);
      setEquipos(found?.teams || []);
      GetTags().then((data) => setDbTagas(data));
    }
  }, [loadingAllHackathons, allHackathons, hackathonId]);

  const handleUpdate = (updatedData) => setHackathon(updatedData);
  //Si no explota, no sacar.
  if (!hackathon) {
    return <div className="text-center mt-10">Cargando hackathon...</div>;
  }

  // Función para determinar estilos y medallas
  const getMedalStyles = (position) => {
    switch (position) {
      case 1:
        return {
          border:
            "metal-shine border-metal-gold bg-yellow-400 text-black border-4 border-yellow-500",
          medal: "🥇",
        };
      case 2:
        return {
          border:
            "metal-shine border-metal-silver bg-gray-400 text-black border-4 border-gray-400",
          medal: "🥈",
        };
      case 3:
        return {
          border:
            "metal-shine border-metal-copper bg-amber-700 text-white border-4 border-amber-700",
          medal: "🥉",
        };
      default:
        return {
          border: "bg-base-300 text-base-content",
          medal: "",
        };
    }
  };

  const isUserInHackathon = isInHackathon(hackathon, user);
  const creator = globalUsers.find((u) => u.id === hackathon.creator_id);

  // vamos a ordenar a los ganadores:
  // Filtrar solo ganadores de este hackathon
  const ganadoresDelHackathon = allWinners.filter(
    (g) => g.hackathon_id === hackathon.id
  );

  // Mapeamos todos los equipos con su posición y puntos si están entre los ganadores
  const equiposEnriquecidos = equipos.map((equipo) => {
    const resultado = ganadoresDelHackathon.find(
      (g) => g.team_id === equipo.id
    );

    return {
      ...equipo,
      position: resultado?.position ?? null,
      points_awarded: resultado?.points_awarded ?? 0,
    };
  });

  // Ordenamos primero por posición (si existe), luego por ID como fallback
  const equiposOrdenados = [...equiposEnriquecidos].sort((a, b) => {
    if (a.position != null && b.position != null)
      return a.position - b.position;
    if (a.position != null) return -1;
    if (b.position != null) return 1;
    return a.id - b.id; // fallback por team_id
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto p-6 bg-base-200 rounded-xl shadow-xl space-y-6"
    >
      <div className="flex justify-between">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold mb-4 card-title">
            {hackathon.title}
            {hackathon.status === "finished" ||
            hackathon.status === "cancelled" ? (
              ""
            ) : user.id === hackathon.creator_id ||
              user.role === "moderator" ? (
              <button
                className="btn btn-primary btn-md ms-5"
                onClick={handleModal}
              >
                Editar Hackathon
              </button>
            ) : (
              ""
            )}
          </h1>
          <EditHackathonModal
            showModal={showModal}
            onClose={handleModal}
            userToken={userToken}
            hackathon={hackathon}
            onUpdate={handleUpdate}
            tags={dbTags}
          />
          <p className=" text-md ">
            Creador del hackathon:
            {` ${
              creator
                ? `${creator.firstname} ${creator.lastname}`
                : "Desconocido"
            }`}
          </p>
          <div className="divider m-0 p-0"></div>
          <p className="text-lg card-title font-bold">
            <User /> {hackathon.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {hackathon.tags.map((tag, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-md bg-base-300 text-base-content"
              >
                {tag.icon && (
                  <DynamicIcon iconName={tag.icon} className="w-5 h-5" />
                )}
                {tag.name}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="flex flex-col ">
          <BadgeHackathonComponent hackathon={hackathon} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-[400px] gap-6">
        {/* LEFT - Ocupa 2/3 en pantallas grandes */}
        <motion.div
          className="left w-full lg:w-2/3 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid bg-base-200 grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card  bg-base-300 text-neutral-content">
              <div className="card-body ">
                <div className="card-title flex-justify-between">
                  <h2 className="card-title ">
                    <CalendarIcon />
                    Fecha de finalización
                  </h2>
                </div>
                <div>
                  <p>{formatDateToISOShort(hackathon.start_date)}</p>
                </div>
              </div>
            </div>
            <div className="card bg-base-300 text-neutral-content">
              <div className="card-body">
                <div className="card-title flex justify-between">
                  <h2 className="card-title">
                    <CalendarIcon />
                    Fecha de finalización
                  </h2>
                  {hackathon.status === "finished" ||
                  hackathon.status === "cancelled" ? (
                    ""
                  ) : user.id === hackathon.creator_id ||
                    user.role === "moderator" ? (
                    // 🔧 FIX: El div estaba mal cerrado causando error de sintaxis
                    <div className="dropdown dropdown-end self-center mt-2 rounded-box btn-primary">
                      <div
                        tabIndex={-1}
                        role="button"
                        className="btn btn-sm btn-primary"
                      >
                        <WarningModalComponent
                          hackathon={hackathon}
                          newState={showWarningModal}
                        />
                        Finalizar
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content text-base-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                      >
                        <li>
                          <a onClick={() => handleWarningModal("finalized")}>
                            <Trophy className="text-warning" />
                            Finalizar hackathon
                          </a>
                        </li>
                        <li>
                          <a onClick={() => handleWarningModal("closed")}>
                            <Frown className="text-error" /> Suspender hackathon
                          </a>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <p>{formatDateToISOShort(hackathon.end_date)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col card bg-base-300 text-neutral-content p-5">
              <h2 className="text-2xl card-title font-semibold mb-2">
                <Scale />
                Reglas
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {hackathon.rules.map((rule) => (
                  <li key={rule.id}>{rule.rule_text}</li>
                ))}
              </ul>
              <div className="divider my-1" />
              <div className="">
                <h2 className="text-2xl card-title font-semibold mb-2">
                  <Users />
                  Límite de equipos
                </h2>
                <li>Cantidad de equipos: {hackathon.max_teams}</li>
                <li>Participantes por equipo: {hackathon.max_team_members}</li>
              </div>
            </div>

            <div className="bg-base-300 text-neutral-content p-5 card">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl card-title font-semibold mb-4">
                    <Trophy /> Jurados{" "}
                  </h2>
                </div>
                <div>
                  {hackathon.status === "finished" ||
                  hackathon.status === "cancelled" ? (
                    ""
                  ) : user.id === hackathon.creator_id ||
                    user.role === "moderator" ? (
                    <label
                      className="btn btn-primary btn-sm"
                      htmlFor="JudgesModal"
                    >
                      Agregar jurados
                    </label>
                  ) : (
                    ""
                  )}
                  <JudgesModalComponent
                    hackathon={hackathon}
                    onHackathonUpdated={updateData}
                  />
                </div>
              </div>

              <div className="divider my-1" />
              {hackathon.judges.length > 0 ? (
                <>
                  <CardCarousel
                    usersArray={hackathon.judges}
                    cardsPerSlide={1}
                    viewport="small"
                  />
                  <div className="label flex justify-end ">
                    <h1 className="text-sm text-center card-title">
                      Este evento tiene{" "}
                      {
                        <p className="text-warning ">
                          {" "}
                          {hackathon.judges.length}
                        </p>
                      }{" "}
                      jurados
                    </h1>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center ">
                  <div className="skeleton w-64 h-64 flex flex-col shadow-sm shadow-primary items-center justify-center rounded-xl bg-base-200 text-center ">
                    <AlertCircle className="w-10 h-10 " />
                    <h2 className="text-lg font-medium">
                      No hay jurados aún...
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* RIGHT - Ocupa 1/3 en pantallas grandes */}
        <motion.div
          className="right w-full lg:w-1/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card bg-base-300 text-neutral-content  ">
            <div className="header flex justify-between items-center px-5 pt-5">
              <h2 className="text-2xl card-title font-semibold">
                {hackathon.status === "finished" ? (
                  <>
                    <Trophy /> Ganadores 🏆
                  </>
                ) : (
                  <>
                    <Users /> ¡Únete a un equipo!
                  </>
                )}
              </h2>
              <h4 className="text-md font-semibold ">
                {hackathon.teams.length}/{hackathon.max_teams}
              </h4>
            </div>
            <div className="divider px-5" />
            <div className="space-y-2 overflow-y-auto h-75  px-5">
              {hackathon.status === "finished"
                ? equiposOrdenados.map((equipo, index) => {
                    const { border, medal } = getMedalStyles(equipo.position);
                    return (
                      <motion.div
                        key={equipo.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`rounded-box px-3 py-2 group hover:scale-105 transition-all bg-base-200 ${border}`}
                      >
                        <NavLink to={`teams/${equipo.id}`}>
                          <div className="text-lg font-medium flex justify-between items-center">
                            <div className="group-hover:text-info flex gap-2 items-center">
                              <motion.div
                                className={`text-2xl `}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {medal}
                              </motion.div>{" "}
                              {equipo.name}
                            </div>
                            <div className="flex gap-x-2 items-center">
                              <AvatarGroupComponent team={equipo.members} />
                              <p className="text-sm">
                                {equipo.members.length}/
                                {hackathon.max_team_members}
                              </p>
                            </div>
                          </div>
                        </NavLink>
                      </motion.div>
                    );
                  })
                : equipos.map((equipo) => (
                    <motion.div
                      key={equipo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-base-200 rounded-box px-3 py-2 group hover:bg-primary hover:scale-105 transition-all"
                    >
                      <NavLink to={`teams/${equipo.id}`}>
                        <div className="text-lg font-medium flex justify-between">
                          <div className="group-hover:text-info">
                            {equipo.name}
                          </div>
                          <div className="flex gap-x-2 items-center">
                            <AvatarGroupComponent team={equipo.members} />
                            <p className="text-sm">
                              {equipo.members.length}/
                              {hackathon.max_team_members}
                            </p>
                          </div>
                        </div>
                      </NavLink>
                    </motion.div>
                  ))}
            </div>
            <div className="flex justify-end align-bottom pb-5 pr-5">
              {hackathon.status === "finished" ? (
                <button className="btn btn-disabled">Finalizado</button>
              ) : hackathon.status === "cancelled" ? (
                <button className="btn btn-disabled">Cancelado</button>
              ) : hackathon.judges.some((j) => j.id === user.id) ? (
                <button className="btn btn-disabled">
                  Eres juez en este evento
                </button>
              ) : !isUserInHackathon ? (
                <label htmlFor="CreateTeamModal" className="btn btn-primary">
                  Crear equipo
                </label>
              ) : (
                <button className="btn btn-disabled">Ya estás inscrito</button>
              )}
              <CreateTeamModal userToken={userToken} hackathon={hackathon} />
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-start"
      >
        <NavLink to={`/dashboard`}>
          <button className="btn btn-primary">volver atrás</button>
        </NavLink>
      </motion.div>
    </motion.div>
  );
};

export default HackatonsComponent;

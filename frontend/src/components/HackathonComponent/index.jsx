import { NavLink } from "react-router";
import TagsComponent from "../../components/TagsComponent";
import AvatarGroupComponent from "../../components/AvatarGroup";
import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { formatDateToISOShort } from "../../utilities/dateUtils";
import { fetchSingleHackathon } from "../../services";
import CardCarousel from "../Carrousel";
import CreateTeamModal from "../CreateTeamModal";
import { isInHackathon } from "../../utilities/userUtils";
const HackatonsComponent = ({ hackathonId }) => {
  const [hackathon, setHackathon] = useState(null);
  const { user, userToken } = useAuth();
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    if (!hackathonId || !userToken) return;

    fetchSingleHackathon(hackathonId, userToken).then((data) => {
      setHackathon(data);
      setEquipos(data.teams);
    });
  }, [hackathonId]);

  //Si no explota, no sacar.
  if (!hackathon) {
    return <div className="text-center mt-10">Cargando hackathon...</div>;
  }

  const isUserInHackathon = isInHackathon(hackathon, user);
  console.log(isUserInHackathon);

  return (
    <div className=" mx-auto  p-6 bg-base-200 rounded-xl shadow-xl space-y-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">{hackathon.title}</h1>
        {/*ya esta responsive */}
        <button
          className={`btn btn-lg   mr-0 ${
            hackathon.status === "open"
              ? "btn-success"
              : hackathon.status === "pending"
              ? "btn-warning"
              : "btn-error"
          }`}
        >
          {hackathon.status}
        </button>
      </div>
      <div>
        <p className="text-lg">{hackathon.description}</p>
      </div>

      <div className=" mt-2 mb-2">
        <TagsComponent tags={hackathon.tags} extraClasses={"bg-base-300"} />
      </div>

      <div className="flex flex-col lg:flex-row w-full min-h-[400px] gap-6">
        {/* LEFT - Ocupa 2/3 en pantallas grandes */}
        <div className="left w-full lg:w-2/3 space-y-4 ">
          <div className="grid bg-base-200 grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card  bg-base-300 text-neutral-content">
              <div className="card-body">
                <h2 className="card-title">Fecha de inicio</h2>
                <p>{formatDateToISOShort(hackathon.start_date)}</p>
              </div>
            </div>
            <div className="card bg-base-300 text-neutral-content">
              <div className="card-body">
                <h2 className="card-title">Fecha de finalización</h2>
                <p>{formatDateToISOShort(hackathon.end_date)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col card bg-base-300 text-neutral-content p-5">
              <h2 className="text-2xl font-semibold mb-2">Reglas</h2>
              <ul className="list-disc list-inside space-y-1">
                {hackathon.rules.map((rule) => (
                  <li key={rule.id}>{rule.rule_text}</li>
                ))}
              </ul>
              <div className="mt-5">
                <h2 className="text-2xl font-semibold mb-2">
                  Límite de equipos
                </h2>
                <p>Cantidad de equipos: {hackathon.max_teams}</p>
                <p>Participantes por equipo: {hackathon.max_team_members}</p>
              </div>
            </div>

            <div className="bg-base-300 text-neutral-content p-5 card">
              <h2 className="text-2xl font-semibold mb-4">Jurados</h2>
              {hackathon.judges.length > 0 ? (
                <CardCarousel
                  usersArray={hackathon.judges}
                  cardsPerSlide={1}
                  viewport="small"
                />
              ) : (
                <h2>No hay jurados aun!</h2>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - Ocupa 1/3 en pantallas grandes */}
        <div className="right w-full lg:w-1/3 ">
          <div className="card bg-base-300 text-neutral-content p-5 h-full">
            <div className="header flex justify-between items-center">
              <h2 className="text-2xl font-semibold mb-4">
                ¡Únete a un equipo!
              </h2>
              <h4 className="text-md font-semibold mb-4">
                {hackathon.teams.length}/{hackathon.max_teams}
              </h4>
            </div>
            <div className="space-y-2 overflow-y-auto h-full">
              {equipos.map((equipo) => (
                <div
                  key={equipo.id}
                  className="bg-base-200 rounded-box px-3 py-2 group"
                >
                  <NavLink to={`teams/${equipo.id}`}>
                    <div className=" text-lg font-medium flex justify-between ">
                      <div className="group-hover:text-accent">
                        {equipo.name}
                      </div>
                      <div className="flex gap-x-2 items-center">
                        <AvatarGroupComponent team={equipo.members} />
                        <p className="text-sm">
                          {equipo.members.length}/{hackathon.max_team_members}
                        </p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))}
            </div>
            <div className="flex justify-end align-bottom mt-10">
              {!isUserInHackathon ? (
                <label htmlFor="CreateTeamModal" className="btn btn-accent">
                  Crear equipo
                </label>
              ) : (
                <button className="btn btn-disabled">Ya estas inscrito</button>
              )}
              <CreateTeamModal userToken={userToken} hackathon={hackathon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackatonsComponent;

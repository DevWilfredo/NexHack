import { useEffect, useState } from "react";
import {
  EditTeam,
  getUsers,
  SendInvitation,
  fetchSingleHackathon,
} from "../../services";
import { useAuth } from "@context/AuthContext";
import { BriefcaseBusiness, FileSliders, Github, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import SearchBar from "../searchBar";
import UserToListcomponent from "../UserToList";
import { useTheme } from "../../context/ThemeContext";

function AddMemberModal({ team, toState, onTeamUpdated }) {
  const [user, setUser] = useState([]);
  const { userToken } = useAuth();
  const [newState, setnewState] = useState("editing");
  const [newData, setNewData] = useState({ ...team });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hackathon, setHackathon] = useState(null);
  const { isDark } = useTheme();

  //  Sync con props actualizadas
  useEffect(() => {
    setNewData({ ...team });
  }, [team]);

  // 🔵 Traer datos iniciales de hackathon y filtrar usuarios válidos
  useEffect(() => {
    if (!userToken || !team?.hackathon_id) return;

    fetchSingleHackathon(team.hackathon_id, userToken).then((data) => {
      //lo guardo por si acaso, pero no es que lo use mas alla de revisar los teams
      setHackathon(data);

      getUsers(userToken).then((allUsers) => {
        const filteredUsers = allUsers.filter((u) => {
          // 1. Ya está en un equipo del hackathon?
          const isInTeam = data.teams?.some((team) =>
            team.members?.some((member) => member.user.id === u.id)
          );
          if (isInTeam) return false;

          // 2. Tiene solicitud pendiente en este equipo?
          const hasPendingRequest = team.requests?.some((request) => {
            return (
              (request.status === "pending" && request.user?.id === u.id) ||
              (request.status === "pending" &&
                request.requested_by?.id === u.id)
            );
          });
          if (hasPendingRequest) return false;

          return true;
        });

        setUser(filteredUsers);
      });
    });
  }, [userToken, team]);

  //  Enviar invitación
  const HandleInvitation = async (toUserId) => {
    const loadingToast = toast.loading("Enviando invitación...");
    SendInvitation(userToken, team.id, toUserId, team.name)
      .then(() => {
        toast.success("Invitación enviada con éxito", { id: loadingToast });
        onTeamUpdated(); // 🔄 actualiza datos desde el padre
      })
      .catch((err) => {
        toast.error("Error al enviar invitación", { id: loadingToast });
        console.error("Error al enviar invitación:", err);
      });
  };

  //  Handle edit equipo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  //  Submit edit equipo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitToast = toast.loading("Actualizando equipo...");
    try {
      const updateTeam = await EditTeam(newData, userToken);
      toast.success("Equipo actualizado", { id: submitToast });
      if (updateTeam) onTeamUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar", { id: submitToast });
    } finally {
      setLoading(false);
      document.getElementById("addMemberModal").checked = false;
    }
  };

  //  Estado modal
  useEffect(() => {
    setnewState(toState);
  }, [toState]);
  //  Vista de agregar miembros
  const AddToTeamView = () => (
    <>
      <div className="flex justify-between items-center ">
        <h3 className="font-bold text-lg">Agregar miembros</h3>
        <label
          htmlFor="addMemberModal"
          className="btn btn-xs btn-circle btn-ghost"
        >
          <X className="hover:text-error" />
        </label>
      </div>

      <div className="mt-4 bg-base-200 p-3 card rounded-box">
        <div className="space-y-2 flex align-baseline gap-2 ps-2 py-2 rounded-box">
          <SearchBar
            placeholder="Buscar usuario..."
            onSearch={setSearchQuery}
          />
        </div>

        {user.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">
            Lista de usuarios aparecerá aquí...
          </p>
        ) : (
          <div className="overflow-y-auto max-h-70 flex flex-col items-center">
            {user
              .filter((us) => {
                const fullName = `${us.firstname} ${us.lastname}`.toLowerCase();
                return fullName.includes(searchQuery.toLowerCase());
              })
              .map((us, index) => (
                <UserToListcomponent
                  key={us.id}
                  index={index}
                  us={us}
                  viewport="addMember"
                  HandleInvitation={HandleInvitation}
                />
              ))}
          </div>
        )}
      </div>
    </>
  );

  // 💡 Vista editar equipo
  const EditTeamView = () => (
    <>
      <div className="flex justify-between items-center ">
        <h3 className="font-bold text-lg">Editar Perfil de Equipo</h3>
        <label
          htmlFor="addMemberModal"
          className="btn btn-xs btn-circle btn-ghost"
        >
          <X className="hover:text-error" />
        </label>
      </div>

      <div className="mt-4 bg-base-200 p-3 card rounded-box">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-x-3 p-2">
            <label>
              <Users />
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre del equipo"
              className="input input-bordered bg-base-300"
              onChange={handleInputChange}
              value={newData.name || ""}
            />
          </div>

          <div className="flex gap-x-3 p-2">
            <label>
              <Github />
            </label>
            <input
              type="text"
              name="github_url"
              placeholder="Link del repositorio"
              className="input input-bordered bg-base-300"
              value={newData.github_url || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-x-3 p-2">
            <label>
              <BriefcaseBusiness />
            </label>
            <input
              type="text"
              name="live_preview_url"
              placeholder="Link al proyecto"
              className="input input-bordered bg-base-300"
              value={newData.live_preview_url || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-x-3 p-2">
            <label>
              <FileSliders />
            </label>
            <textarea
              name="bio"
              placeholder="Descripción del equipo"
              className="textarea textarea-bordered bg-base-300"
              onChange={handleInputChange}
              value={newData.bio || ""}
            />
          </div>

          <div className="flex justify-end">
            <button
              className={`btn ${isDark ? "btn-accent" : "btn-primary"}`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <>
      <input type="checkbox" id="addMemberModal" className="modal-toggle" />
      <div className="modal">
        <div
          className={`modal-box w-full max-w-2xl space-y-4 bg-base-300 shadow-xl/40 ${
            isDark ? "shadow-accent" : "shadow-primary"
          }`}
        >
          {newState === "AddingMembers" ? AddToTeamView() : EditTeamView()}
        </div>
      </div>
      <label className="modal-backdrop" htmlFor="addMemberModal"></label>
    </>
  );
}

export default AddMemberModal;

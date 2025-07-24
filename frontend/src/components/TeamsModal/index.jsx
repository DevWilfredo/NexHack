import { useEffect, useState } from "react";
import { EditTeam, getUsers, SendInvitation } from "../../services";
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
  const { isDark } = useTheme();

  //enviar actualizacion de equipo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitToast = toast.loading("Actualizando informacion...");
    try {
      const updateTeam = await EditTeam(newData, userToken);

      toast.success("Equipo actualizado con éxito", { id: submitToast });
      if (updateTeam) onTeamUpdated(); // <-- AVISA AL PADRE
    } catch (err) {
      console.error("Error al actualizar equipo:", err);
      toast.error("Error al actualizar equipo", { id: submitToast });
    } finally {
      setLoading(false);
      document.getElementById("addMemberModal").checked = false;
    }
  };

  //conseguir la info de los usuarios
  useEffect(() => {
    if (!userToken) return;
    getUsers(userToken).then((data) => {
      setUser(data);
    });
  }, []);

  //para abrir el modal en la version correcta
  useEffect(() => {
    setnewState(toState);
  }, [toState]);

  //editamos el equipo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };
  // unete a mi equipo
  const HandleInvitation = async (toUserId) => {
    const loadingToast = toast.loading("Enviando invitación...");
    SendInvitation(userToken, team.id, toUserId, team.name)
      .then((data) => {
        toast.success("Invitacion enviada con exito!", { id: loadingToast });
        if (onTeamUpdated) onTeamUpdated();
      })
      .catch((err) => {
        toast.error("Error al enviar invitación", { id: loadingToast });
        console.error("Error al enviar invitación:", err);
      });
  };

  const AddToTeamView = () => (
    <>
      {/*Es el modal para agregar miembros*/}
      <div className="flex justify-between items-center ">
        <h3 className="font-bold text-lg ">Agregar miembros</h3>
        <label
          htmlFor="addMemberModal"
          className="btn btn-xs btn-circle btn-ghost"
        >
          <X className="  hover:text-error" />
        </label>
      </div>
      {/* Aquí luego puedes hacer el .map() con los usuarios */}
      <div
        className="mt-4 bg-base-200
           p-3 card rounded-box"
      >
        <div className="space-y-2 flex align-baseline gap-2 bg-base-200  ps-2 py-2 rounded-box">
          <SearchBar
            placeholder="Buscar usuario..."
            onSearch={(value) => setSearchQuery(value)}
          />
        </div>
        {user.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">
            Lista de usuarios aparecerá aquí...
          </p>
        ) : (
          <div className="overflow-y-auto  max-h-70 flex flex-col items-center">
            {user
              .filter((us) => {
                const fullName = `${us.firstname} ${us.lastname}`.toLowerCase();
                return (
                  searchQuery === "" ||
                  fullName.includes(searchQuery.toLowerCase())
                );
              })

              .map((us, index) => (
                <UserToListcomponent
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

  const EditTeamView = () => (
    <>
      {/*Es el modal para agregar miembros*/}
      <div className="flex justify-between items-center ">
        <h3 className="font-bold text-lg ">Editar Perfil de Equipo</h3>
        <label
          htmlFor="addMemberModal"
          className="btn btn-xs btn-circle btn-ghost"
        >
          <X className="  hover:text-error" />
        </label>
      </div>
      {/* Aquí luego puedes hacer el .map() con los usuarios */}
      <div
        className="mt-4 bg-base-200
           p-3 card rounded-box"
      >
        <div className="space-y-2  align-baseline gap-2 bg-base-200  ps-2 py-2 rounded-box">
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
                className="input input-bordered  bg-base-300"
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
                onChange={handleInputChange}
                placeholder="Link al proyecto"
                value={newData.live_preview_url || ""}
                className="input input-bordered  bg-base-300"
              />
            </div>
            <div className="flex gap-x-3 p-2">
              <label>
                <FileSliders />
              </label>
              <textarea
                name="bio"
                placeholder="Descripcion del equipo"
                className="textarea textarea-bordered  bg-base-300"
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
      </div>
    </>
  );

  return (
    <>
      {/* Modal DaisyUI */}
      <input type="checkbox" id="addMemberModal" className="modal-toggle" />
      <div className="modal ">
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

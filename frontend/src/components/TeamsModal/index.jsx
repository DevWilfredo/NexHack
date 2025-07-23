import React, { useEffect, useState } from "react";
import { EditTeam, getUsers, SendInvitation } from "../../services";
import { useAuth } from "@context/AuthContext";
import {
  BriefcaseBusiness,
  FileSliders,
  Github,
  UserPlus,
  Users,
  UserSearch,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function AddMemberModal({ team, toState, onTeamUpdated }) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState([]);
  const { userToken } = useAuth();
  const [newState, setnewState] = useState("editing");
  const [newData, setNewData] = useState({ ...team });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const submitToast = toast.loading("Enviando invitación...");
    try {
      const updateTeam = await EditTeam(newData, userToken);
      console.log(updateTeam);

      toast.success("Equipo actualizado con éxito", { id: submitToast });
      if (onTeamUpdated) onTeamUpdated(); // <-- AVISA AL PADRE
    } catch (err) {
      console.error("Error al actualizar equipo:", err);
      toast.error("Error al actualizar equipo", { id: submitToast });
    } finally {
      setLoading(false);
      document.getElementById("addMemberModal").checked = false;
    }
  };

  useEffect(() => {
    if (!userToken) return;
    getUsers(userToken).then((data) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    console.log(toState);
    setnewState(toState);
  }, [toState]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

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
        className="mt-4 bg-neutral
           p-3 card rounded-box"
      >
        {/* Input para buscar miembros */}
        <div className="space-y-2 flex align-baseline gap-2 bg-neutral  ps-2 py-2 rounded-box">
          <UserSearch className=" text-gray-400 w-7 h-7" />
          <input
            type="text"
            placeholder="Buscar usuario"
            className="input input-bordered"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {user.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">
            Lista de usuarios aparecerá aquí...
          </p>
        ) : (
          <div className="overflow-y-auto max-h-70">
            {user
              .filter((us) => {
                const fullName = `${us.firstname} ${us.lastname}`.toLowerCase();
                return (
                  search.trim() === "" ||
                  fullName.includes(search.toLowerCase())
                );
              })
              .map((us, index) => (
                <div
                  key={index}
                  className={` card rounded-box p-3  my-2 ${
                    index % 2 === 0
                      ? "shadow-md border-primary border-1 shadow-primary"
                      : " shadow-md border-accent border-1 shadow-accent"
                  }     hover:bg-primary cursor-pointer`}
                >
                  <div className="flex justify-between  w-full ">
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          us.profile_picture
                            ? `${
                                import.meta.env.VITE_API_URL
                              }/users/profile_pictures/${us.profile_picture}`
                            : `https://placehold.co/400x400?text=${
                                us.firstname?.charAt(0)?.toUpperCase() || "U"
                              }`
                        }
                        className="w-8 h-8 rounded-full"
                      />
                      <p>
                        {us.firstname} {us.lastname}
                      </p>
                    </div>
                    <div className=" px-4 hover:text-success">
                      <button
                        className="btn btn-ghost"
                        onClick={() => HandleInvitation(us.id)}
                      >
                        <UserPlus />
                      </button>
                    </div>
                  </div>
                </div>
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
        className="mt-4 bg-neutral
           p-3 card rounded-box"
      >
        <div className="space-y-2  align-baseline gap-2 bg-neutral  ps-2 py-2 rounded-box">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-x-3 p-2">
              <label>
                <Users />
              </label>
              <input
                type="text"
                name="name"
                placeholder="Nombre del equipo"
                className="input input-bordered"
                onChange={handleInputChange}
                value={newData.name || ""}
              />
            </div>
            <div className="flex gap-x-3 p-2">
              <label>
                <FileSliders />
              </label>
              <input
                type="text"
                name="bio"
                placeholder="Descripcion del equipo"
                className="input input-bordered "
                onChange={handleInputChange}
                disabled
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
                className="input input-bordered"
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
                className="input input-bordered"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-primary mt-4"
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
        <div className="modal-box w-full max-w-2xl space-y-4 bg-base-100 shadow-xl shadow-primary">
          {newState === "AddingMembers" ? AddToTeamView() : EditTeamView()}
        </div>
      </div>
      <label className="modal-backdrop" htmlFor="addMemberModal"></label>
    </>
  );
}

export default AddMemberModal;

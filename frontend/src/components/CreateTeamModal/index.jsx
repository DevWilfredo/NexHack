import { useState } from "react";
import { Users, Github, BriefcaseBusiness, FileSliders, X } from "lucide-react";
import { useTheme } from "@context/ThemeContext";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useApp } from "@context/AppContext";
function CreateTeamModal({ userToken, hackathon }) {
  const { isDark } = useTheme();
  const { fetchMyHackathons, fetchAllHackathons } = useApp();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    github_url: "",
    live_preview_url: "",
    bio: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setNewData({
      name: "",
      github_url: "",
      live_preview_url: "",
      bio: "",
    });
  };

  const postANewTeam = async (userToken, newData, hackathonId) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/teams/${hackathonId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(newData),
      }
    );
    const data = await response.json();
    return data;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creando equipo...");

    try {
      const result = await postANewTeam(userToken, newData, hackathon.id);

      toast.success(`Equipo "${result.name}" creado`, {
        id: toastId,
        duration: 2000,
      });
      fetchMyHackathons();
      fetchAllHackathons();

      // Esperar 2 segundos y redirigir
      setTimeout(() => {
        navigate(`/hackathons/${hackathon.id}/teams/${result.id}`);
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Error al crear el equipo", {
        id: toastId,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input type="checkbox" id="CreateTeamModal" className="modal-toggle" />
      <div className="modal">
        <div
          className={`modal-box w-full max-w-2xl space-y-4 bg-base-300 shadow-xl/40 ${
            isDark ? "shadow-accent" : "shadow-primary"
          }`}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{`¡Estas por crear un equipo para ${hackathon.title} !`}</h3>
            <label
              htmlFor="CreateTeamModal"
              className="btn btn-xs btn-circle btn-ghost"
              onClick={handleClose}
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
                  className="input input-bordered bg-base-300 w-full"
                  onChange={handleInputChange}
                  value={newData.name}
                  required
                />
              </div>

              <div className="flex gap-x-3 p-2">
                <label>
                  <Github />
                </label>
                <input
                  type="text"
                  name="github_url"
                  placeholder="(Opcional) Link de GitHub"
                  className="input input-bordered bg-base-300 w-full"
                  onChange={handleInputChange}
                  value={newData.github_url}
                />
              </div>

              <div className="flex gap-x-3 p-2">
                <label>
                  <BriefcaseBusiness />
                </label>
                <input
                  type="text"
                  name="live_preview_url"
                  placeholder="(Opcional) Link al proyecto"
                  className="input input-bordered bg-base-300 w-full"
                  onChange={handleInputChange}
                  value={newData.live_preview_url}
                />
              </div>

              <div className="flex gap-x-3 p-2">
                <label>
                  <FileSliders />
                </label>
                <textarea
                  name="bio"
                  placeholder="(Recomendado) Descripción del equipo"
                  className="textarea textarea-bordered bg-base-300 w-full"
                  onChange={handleInputChange}
                  value={newData.bio}
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className={`btn ${isDark ? "btn-accent" : "btn-primary"}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear equipo"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="CreateTeamModal"></label>
      </div>
    </>
  );
}

export default CreateTeamModal;

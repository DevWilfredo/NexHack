import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../searchBar";
import { Frown, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import UserToJudgesComponent from "../UserToJudges";
import { addJudge } from "../../services";
import toast from "react-hot-toast";

function JudgesModalComponent({ hackathon }) {
  const { userToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { globalUsers, fetchAllHackathons } = useApp();

  const handleInvitation = async (toUserId) => {
    const loadingToast = toast.loading("Agregando juez");
    addJudge({ hackathonId: hackathon.id, token: userToken, userId: toUserId })
      .then(() => {
        toast.success("Juez agregado con éxito!", { id: loadingToast });

        fetchAllHackathons(); // Evita error si no se pasa el prop
      })
      .catch((err) => {
        toast.error("Error al añadir juez", { id: loadingToast });
        console.error("Error al añadir juez", err);
      });
  };
  //solo personas elegibles, ordenados de mayor a menor punto
  const getEligibleUsers = (globalUsers, hackathon, searchQuery = "") => {
    return globalUsers
      .filter((user) => {
        if (user.id === hackathon.creator_id) return false;

        const isInTeam = hackathon.teams.some((team) =>
          team.members.some((member) => member.user.id === user.id)
        );
        if (isInTeam) return false;

        const isJudge = hackathon.judges.some((judge) => judge.id === user.id);
        if (isJudge) return false;

        const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
        if (!fullName.includes(searchQuery.toLowerCase())) return false;

        return true;
      })
      .sort((a, b) => (b.points || 0) - (a.points || 0));
  };
  const elegibleUsers = getEligibleUsers(globalUsers, hackathon, searchQuery);
  console.log(hackathon);

  return (
    <>
      <input type="checkbox" id="JudgesModal" className="modal-toggle" />
      <div className=" modal ">
        <div className="items-center modal-box w-full max-w-2xl space-y-4 bg-base-300 shadow-xl/40 ">
          <div className="flex justify-between  ">
            <h3 className="font-bold text-lg">Agregar miembros al jurado</h3>
            <label
              htmlFor="JudgesModal"
              className="btn btn-xs btn-circle btn-ghost"
            >
              <X className="hover:text-error" />
            </label>
          </div>

          <div className="mt-4 bg-base-200 p-3 card rounded-box">
            <div className="space-y-2 flex align-baseline gap-2 ps-2 py-2 rounded-box ">
              <SearchBar
                placeholder="Buscar usuario..."
                onSearch={setSearchQuery}
                spacing={"sm"}
              />
            </div>
            <div className="overflow-y-auto max-h-70 flex flex-col items-center">
              {(() => {
                const usuariosFiltrados = elegibleUsers.filter((us) => {
                  const fullName =
                    `${us.firstname} ${us.lastname}`.toLowerCase();
                  return fullName.includes(searchQuery.toLowerCase());
                });

                if (usuariosFiltrados.length > 0) {
                  return usuariosFiltrados.map((us, index) => (
                    <UserToJudgesComponent
                      key={us.id}
                      index={index}
                      us={us}
                      handleInvitation={handleInvitation}
                    />
                  ));
                } else {
                  return (
                    <div className="flex flex-col items-center mt-4 text-gray-400 space-y-2">
                      <Frown className="w-6 h-6" />
                      <p className="text-sm text-center">
                        No se encontro usuarios con ese nombre
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
      <label className="modal-backdrop" htmlFor="JudgesModal"></label>
    </>
  );
}

export default JudgesModalComponent;

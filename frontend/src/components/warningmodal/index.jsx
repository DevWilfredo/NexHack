import { X } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { finalizeHackathon, suspendHackathon } from "../../services";
import { useApp } from "@context/AppContext";
import { toast } from "react-hot-toast"; // ✅ Importar react-hot-toast

function WarningModalComponent({ hackathon, newState }) {
  const { userToken } = useAuth();
  const { fetchAllHackathons, fetchAllWinners } = useApp();

  const handleFinalize = async () => {
    const toastId = toast.loading("Finalizando hackathon...");
    try {
      const data = await finalizeHackathon(hackathon.id, userToken);
      toast.success("Hackathon finalizado", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Error al finalizar el hackathon", { id: toastId });
    } finally {
      fetchAllHackathons();
      fetchAllWinners();
    }
  };

  const handleSuspended = async () => {
    const toastId = toast.loading("Suspendiendo hackathon...");
    try {
      const data = await suspendHackathon(hackathon.id, userToken);
      toast.success("Hackathon suspendido", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Error al suspender el hackathon", { id: toastId });
    } finally {
      fetchAllHackathons();
    }
  };

  const getContent = () => {
    let message = "";
    let action = "";

    switch (newState) {
      case "finalized":
        message = "¿Estás seguro de que deseas finalizar el ";
        action = "Finalizar";
        break;
      case "closed":
        message = "¿Estás seguro de que deseas suspender el ";
        action = "Suspender";
        break;
      default:
        message = "¿Estás seguro de que deseas continuar con ";
        action = "Confirmar";
    }

    return (
      <div className="modal-box bg-base-300 text-base-content">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <X />
          </button>
        </form>
        <h1 className="font-bold text-xl text-start">{action}</h1>
        <p className="py-4 text-lg text-start">
          {message}
          <span className="text-info font-bold">{hackathon.title || ""}</span>?
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <form method="dialog" className="space-x-5">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                newState === "finalized"
                  ? handleFinalize()
                  : newState === "closed"
                  ? handleSuspended()
                  : toast.error("Acción no válida")
              }
            >
              Aceptar
            </button>
            <button className="btn">Cancelar</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <dialog id="warningmodal" className="modal">
      {getContent()}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default WarningModalComponent;

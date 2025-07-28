import { X } from "lucide-react";

import { useAuth } from "@context/AuthContext";
import { finalizeHackathon, suspendHackathon } from "../../services";
import { useApp } from "@context/AppContext";

function WarningModalComponent({ hackathon, newState }) {
  const { userToken } = useAuth();
  const { fetchAllHackathons } = useApp();

  const handleFinalize = () => {
    const response = finalizeHackathon(hackathon.id, userToken);
    try {
      response.then((data) => {
        console.log(data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      fetchAllHackathons();
    }
  };

  const handleSuspended = () => {
    const response = suspendHackathon(hackathon.id, userToken);
    try {
      response.then((data) => {
        console.log(data);
      });
    } catch (error) {
      console.log(error);
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
      <div className="modal-box bg-base-300">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <X />
          </button>
        </form>{" "}
        <h1 className="font-bold text-xl text-start">{action}</h1>
        <p className="py-4 text-lg text-start">
          {message}
          <span className="text-info font-bold">{hackathon.title}</span>?
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <form method="dialog" className="space-x-5">
            <button
              className="btn btn-primary"
              onClick={() =>
                newState === "finalized"
                  ? handleFinalize()
                  : newState === "closed"
                  ? handleSuspended()
                  : console.log("fallo el state del modal")
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

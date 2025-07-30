import { Dot, Scale, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import RaitingStarsComponent from "../RatingStars";
import { useAuth } from "@context/AuthContext";
import { EvaluateHackathon } from "../../services";
import { toast } from "react-hot-toast";
import { useApp } from "@context/AppContext";

function EvaluationModalComponent({ showModal, onClose, team }) {
  const dialogRef = useRef(null);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const { userToken } = useAuth();
  const { fetchAllHackathons, fetchScores } = useApp();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (showModal) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    dialog?.addEventListener("cancel", handleCancel);
    return () => dialog?.removeEventListener("cancel", handleCancel);
  }, [showModal, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Enviando evaluación...");

    try {
      await EvaluateHackathon(
        team.hackathon_id,
        team.id,
        {
          score: rating,
          feedback: comment,
        },
        userToken
      );
      toast.success("¡Evaluación enviada con éxito!", { id: toastId });
      fetchAllHackathons();
      fetchScores();
      onClose();
    } catch (err) {
      toast.error(err.message || "Ocurrió un error al enviar la evaluación", {
        id: toastId,
      });
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClick={handleBackdropClick}>
      <div className="modal-box relative text-start bg-base-300">
        <button
          type="button"
          className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="hover:text-error" />
        </button>
        <h3 className="text-start font-bold text-lg card-title mb-0">
          <Scale /> Evaluación del Equipo
        </h3>
        <div className="divider my-0" />
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <p className="card-title">
              <Dot /> ¿Qué te pareció el trabajo de {team.name}?
            </p>
            <div className="mt-3 ms-10">
              <RaitingStarsComponent value={rating} onChange={setRating} />
            </div>
            <p className="text-start py-4 mb-0 ms-4">
              ¡Recuerda que cada estrella equivale a 2 puntos!.
            </p>
            <div className="divider my-2" />
            <div className="flex">
              <Dot />
              <p>Déjale un comentario para {team.name}</p>
            </div>
            <fieldset className="fieldset ms-4 mt-2">
              <textarea
                className="textarea h-24 bg-base-200 w-full rounded-box focus:bg-base-300"
                placeholder="Comentario...."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div className="label">
                (Recuerda que esto se verá en la sección de comentarios).
              </div>
            </fieldset>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary mt-4">Enviar</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default EvaluationModalComponent;

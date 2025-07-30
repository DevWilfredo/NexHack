import { MessageSquareText, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@context/AuthContext";
import { toast } from "react-hot-toast";
import { useApp } from "@context/AppContext";
import Rating5StarsComponent from "../Rating5Stars";
import { SendFeedback } from "../../services";

function FeedbackUsersComponent({ showModal, onClose, team, toUserId }) {
  const dialogRef = useRef(null);

  const [comment, setComment] = useState("");
  const { user, userToken } = useAuth();
  const { fetchAllHackathons, fetchScores } = useApp();
  const [rating, setRating] = useState(3);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (showModal) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }

    const handleCancel = (e) => {
      e.preventDefault();
      setComment("");
      onClose();
    };

    dialog?.addEventListener("cancel", handleCancel);
    return () => dialog?.removeEventListener("cancel", handleCancel);
  }, [showModal, onClose]);

  const handleClose = () => {
    setComment("");
    onClose(); // sigue ejecutando la función original del padre
  };
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      setComment("");
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Enviando Comentario...");

    try {
      await SendFeedback(
        toUserId,
        team.id,
        team.hackathon_id,
        comment,
        rating,
        userToken
      );

      toast.success("Comentario enviado con éxito!", { id: toastId });
      fetchAllHackathons();
      fetchScores();
      setComment("");
      onClose();
    } catch (err) {
      toast.error(err.message || "Ocurrió un error al enviar el comentario", {
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
          onClick={handleClose}
        >
          <X className="hover:text-error" />
        </button>
        <h3 className="text-start font-bold text-lg card-title mb-0">
          <MessageSquareText /> ¿Que te parecio el trabajo de?
        </h3>
        <div className="divider my-0" />
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <p className="card-title">¿Cuantos puntos le darias?</p>
            <div className="mt-3 ms-10">
              <Rating5StarsComponent
                value={3}
                onChange={(val) => console.log("Nuevo rating:", val)}
              />
            </div>
            <p className="text-start py-4 mb-0 ms-4">
              ¡Recuerda que cada que solo puedes dar de a 1 estrella!.
            </p>
            <div className="divider my-0" />
            <p className="card-title">¿Cuantos puntos le darias?</p>
            <fieldset className="fieldset ms-4 mt-2">
              <textarea
                className="textarea h-24 bg-base-200 w-full rounded-box focus:bg-base-300"
                placeholder="Comentario...."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <div className="label flex justify-end">
                (Recuerda que esto se verá en la sección de comentarios en su
                perfil).
              </div>
            </fieldset>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-primary mt-4 mr-2"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button className="btn btn-success mt-4">Enviar</button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default FeedbackUsersComponent;

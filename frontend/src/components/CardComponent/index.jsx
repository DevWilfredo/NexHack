import { ThumbsUp, Trophy } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import {
  GetFeddbackFromUser,
  GetLikesFromUser,
  LikeToggle,
} from "../../services";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import WarningModalComponent from "../warningmodal";
import FeedbackUsersComponent from "../FeedbackUsers";

const CardComponent = ({
  userArray,
  sizeToview = "",
  showLikeButton = false,
  showCommentButton = false,
  teamData = null,
}) => {
  const { isDark } = useTheme();
  const isSmall = sizeToview?.trim().toLowerCase() === "small";
  const [isLiked, setIsLiked] = useState(false);
  const { user, userToken } = useAuth();
  const [showModal, setShowModal] = useState();
  const [listOfLike, setListofLikes] = useState([]);
  const [listOfFeedback, setListOfFeedback] = useState([]);
  const [showFeedbackButton, setShowFeedbackButton] = useState(false);
  const isMe = user.id === userArray.id;

  const handleModal = () => setShowModal((prev) => !prev);
  const handleIsLiked = async (toUserId) => {
    const toastId = toast.loading("Procesando like...");

    try {
      const data = await LikeToggle(
        teamData.hackathon_id,
        toUserId,
        teamData.id,
        userToken
      );

      // Mensaje basado en la respuesta
      const successMessage =
        data.message === "Like eliminado."
          ? "Like eliminado con éxito."
          : "¡Like agregado con éxito!";

      toast.success(successMessage, { id: toastId });

      // Solo cambiamos el estado si fue exitoso
      setIsLiked((prev) => !prev);
    } catch (err) {
      toast.error(err.message || "Error al dar like", { id: toastId });
    }
  };

  useEffect(() => {
    GetLikesFromUser(userArray.id, userToken).then((data) => {
      setListofLikes(data);
      console.log("Estos son mis likes", data);
      setIsLiked(
        data.some((like) => {
          return (
            like.from_user.id === user.id &&
            like.hackathon_id === teamData.hackathon_id &&
            like.team_id === teamData.id
          );
        })
      );
      console.log(isLiked);
    });
    GetFeddbackFromUser(userArray.id, userToken).then((data) => {
      setListOfFeedback(data);
      console.log("estos son mis feedbacks", data);
      setShowFeedbackButton(
        data.some((feedback) => {
          return (
            feedback.from_user_id === user.id &&
            feedback.hackathon_id === teamData.hackathon_id &&
            feedback.team_id === teamData.id
          );
        })
      );
      console.log("ya me dio feedback el que esta viendo?", showFeedbackButton);
    });
  }, [userArray]);

  console.log("soy yo?", isMe);
  return (
    <div
      key={userArray.id}
      className={`carousel-item ${isSmall ? "w-70" : "w-1/2"}`}
    >
      <div
        className={`card card-side bg-base-200 shadow-xl/20 ${
          isDark ? "shadow-accent" : "shadow-primary"
        } border border-info/1 hover:scale-105 transition-all`}
      >
        <figure>
          <img
            src={
              userArray.profile_picture
                ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${
                    userArray.profile_picture
                  }`
                : `https://placehold.co/400x400?text=${
                    userArray?.firstname?.charAt(0)?.toUpperCase() || "U"
                  }`
            }
            alt="profile"
            className={` ${isSmall ? "w-30" : "w-70"} object-cover`}
          />
        </figure>
        <div className="card-body bg-base-300">
          <h2 className="card-title self-center">
            {userArray.firstname}{" "}
            {showLikeButton && !isMe && (
              <ThumbsUp
                size={20}
                className={`${
                  isLiked ? "text-success" : "text-base-content"
                } hover:scale-120 transition-all`}
                onClick={() => handleIsLiked(userArray.id)}
              />
            )}
          </h2>
          <div className="flex gap-2 items-center">
            <Trophy size={25} className="text-warning" />
            <h4 className="text-lg">{userArray?.points || 0} pts</h4>
          </div>
          <div className="card-actions justify-end flex flex-col sm:flex-row gap-2">
            <NavLink to={`/profile/${userArray.id}`}>
              <button className={`btn btn-sm btn-primary hover:btn-info`}>
                Ver perfil
              </button>
            </NavLink>
            {showCommentButton && !isMe && !showFeedbackButton && (
              <button
                className="btn btn-sm btn-outline btn-success"
                onClick={handleModal}
              >
                Dejar comentario
              </button>
            )}
            <FeedbackUsersComponent
              showModal={showModal}
              onClose={handleModal}
              team={teamData}
              toUserId={userArray.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardComponent;

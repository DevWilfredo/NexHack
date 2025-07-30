import { Bell, Star, Rocket, CheckCircle, Frown } from "lucide-react";
import { motion } from "framer-motion";
import { markNotificationAsRead } from "@services";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const NotificationBell = () => {
  const { user, setUser, userToken } = useAuth();
  const unreadNotifications = user?.notifications?.filter((n) => !n.read) || [];

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, userToken);

      const updated = user.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      setUser({ ...user, notifications: updated });

      toast.success("Notificación marcada como leída", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("Error al marcar como leída", { position: "bottom-right" });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "invitation":
        return <Star className="w-4 h-4 text-purple-500" />;
      case "hackathon_start":
        return <Rocket className="w-4 h-4 text-green-500" />;
      case "evaluation":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "general":
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBgColor = (type) => {
    return "bg-base-200 hover:bg-base-300";
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <Bell className="w-5 h-5" />
          {unreadNotifications.length > 0 && (
            <span className="badge badge-sm badge-error indicator-item">
              {unreadNotifications.length}
            </span>
          )}
        </div>
      </div>

      <div
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto"
      >
        {unreadNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-base-content opacity-70">
            <Frown className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm font-medium">No tienes notificaciones nuevas</p>
          </div>
        ) : (
          unreadNotifications.map((n, idx) => {
            const getRingColor = (type) => {
              switch (type) {
                case "invitation":
                  return "ring-purple-500";
                case "evaluation":
                  return "ring-blue-500";
                case "like_received":
                  return "ring-pink-500";
                case "team_accept":
                  return "ring-green-500";
                case "team_reject":
                  return "ring-red-500";
                default:
                  return "ring-base-300";
              }
            };

            const fromUser = n.data?.from_user;
            const fullName = fromUser
              ? `${fromUser.firstname} ${fromUser.lastname}`
              : "Sistema";
            const firstLetter = fromUser?.firstname?.[0] || "U";
            const avatar = fromUser?.profile_picture
              ? `${import.meta.env.VITE_API_URL}/users/profile_pictures/${fromUser.profile_picture}`
              : `https://placehold.co/400x400?text=${firstLetter}`;

            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.25 }}
                className={`mb-2 p-3 rounded cursor-pointer hover:bg-base-300 hover:shadow-md transition-all ${getBgColor(
                  n.type
                )}`}
                onClick={() => handleMarkAsRead(n.id)}
              >
                <div className="flex gap-3 items-center">
                  <div className="avatar">
                    <div
                      className={`w-10 h-10 rounded-full ring ${getRingColor(
                        n.type
                      )} ring-offset-base-100 ring-offset-2`}
                    >
                      <img alt="Avatar" src={avatar} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium leading-snug">
                      <span className="font-semibold">{fullName}</span>{" "}
                      <span className="text-muted">{n.message}</span>
                    </p>

                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <div
                        className="flex items-center gap-1"
                        title={n.type.replaceAll("_", " ")}
                      >
                        {getIcon(n.type)}
                        <span className="uppercase tracking-wider">
                          {n.type.replaceAll("_", " ")}
                        </span>
                      </div>
                      <span className="italic">
                        {new Date(n.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {idx < unreadNotifications.length - 1 && (
                  <div className="border-b border-base-300 mt-3" />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationBell;

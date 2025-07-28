import {
  Bell,
  Star,
  Rocket,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
          <span className="text-sm text-muted-foreground">
            No tienes notificaciones pendientes
          </span>
        ) : (
          <AnimatePresence>
            {unreadNotifications.map((n, idx) => (
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
                <div className="flex items-start gap-3">
                  {getIcon(n.type)}
                  <div className="flex-1">
                    <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-1">
                      {n.type.replaceAll("_", " ")}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {n.message}
                    </p>
                    <p className="text-xs text-right text-muted mt-1 italic">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {idx < unreadNotifications.length - 1 && (
                  <div className="border-b border-base-300 mt-3" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;

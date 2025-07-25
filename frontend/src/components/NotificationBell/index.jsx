import { Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { markNotificationAsRead } from "@services";

const NotificationBell = () => {
  const { user } = useAuth();
  const [hiddenIds, setHiddenIds] = useState([]);

  const unreadCount = user?.notifications?.filter(
    (n) => !n.read && !hiddenIds.includes(n.id)
  ).length;

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await markNotificationAsRead(id, token);
      setHiddenIds((prev) => [...prev, id]);
    } catch (error) {
      console.error("Error al marcar como leída", error);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="badge badge-sm badge-error indicator-item">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-72 max-h-96 overflow-y-auto"
      >
        {user.notifications.length === 0 ? (
          <span className="text-sm">No hay notificaciones</span>
        ) : (
          user.notifications
            .filter((n) => !hiddenIds.includes(n.id))
            .map((n) => (
              <div
                key={n.id}
                className={`mb-2 p-2 rounded cursor-pointer ${
                  n.read ? "bg-base-300" : "bg-base-200"
                }`}
                onClick={() => handleMarkAsRead(n.id)}
              >
                <p className="text-sm">{n.message}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NotificationBell;

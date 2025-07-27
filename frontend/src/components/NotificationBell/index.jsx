import { Bell } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getUserNotifications, markNotificationAsRead } from "@services";
import { useAuth } from "../../context/AuthContext";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const { userToken } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getUserNotifications(userToken);
      setNotifications(data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  }, [userToken]);

    useEffect(() => {
      fetchNotifications();
  },  [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, userToken);
      fetchNotifications();
    } catch (error) {
      console.error("Error al marcar como leída", error);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

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
        {unreadCount === 0 ? (
          <span className="text-sm">No tienes notificaciones pendientes</span>
        ) : (
          unreadNotifications.map((n) => (
            <div
              key={n.id}
              className="mb-2 p-2 rounded cursor-pointer bg-base-200"
              onClick={() => handleMarkAsRead(n.id)}
            >
              <p className="font-semibold text-sm">{n.type}</p>
              <p className="text-xs">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBell;

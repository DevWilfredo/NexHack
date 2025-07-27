import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserNotifications, markNotificationAsRead } from "@services";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(token);
        setNotifications(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, token);
      setHiddenIds((prev) => [...prev, id]);
    } catch (error) {
      console.error("Error al marcar como leída", error);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && !hiddenIds.includes(n.id)
  ).length;

  const visibleNotifications = notifications.filter(
    (n) => !n.read && !hiddenIds.includes(n.id)
  );

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
        {visibleNotifications.length === 0 ? (
          <span className="text-sm">No tienes notificaciones pendientes</span>
        ) : (
          visibleNotifications.map((n) => (
            <div
              key={n.id}
              className={`mb-2 p-2 rounded cursor-pointer ${
                n.read ? "bg-base-300" : "bg-base-200"
              }`}
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

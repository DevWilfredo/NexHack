import { useState, useEffect } from "react";
import { useAuth } from "@context/AuthContext";
import { getUserNotifications } from "@services";

const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.id) {
      getUserNotifications(user.id).then((notis) => {
        setNotifications(notis);
      });
    }
  }, [user]);

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <div key={n.id} className="p-4 bg-base-200 rounded">
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;

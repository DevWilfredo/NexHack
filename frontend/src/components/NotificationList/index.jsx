import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
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

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isExiting: true } : n))
    );

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  }
  return (
    <div className="space-y-2">
        <AnimatePresence>
  {notifications.map((n) => (
    <motion.div
      key={n.id}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: 50 }}
      transition={{ duration: 2.8 }}
      onClick={() => removeNotification(n.id)}
      className="p-4 rounded-xl bg-base-200 shadow-md cursor-pointer hover:scale-105 transition-transform"
    >
      <h4 className="text-md font-semibold text-base-content">{n.title}</h4>
      <p className="text-sm text-base-content/70">{n.message}</p>
      <div className="flex items-center gap-1 text-xs text-base-content/60 mt-2">
        <Calendar size={14} />
        <span>{new Date(n.created_at).toLocaleDateString("es-ES")}</span>
      </div>
    </motion.div>
  ))}
</AnimatePresence>

    </div>
  );
};

export default NotificationList;

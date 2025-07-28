import { Smile, Meh, Frown, Ban, Check } from "lucide-react";

function BadgeHackathonComponent({ hackathon }) {
  const statusMap = {
    open: {
      text: "Plazas disponibles para equipos",
      color: "bg-success text-content",
      icon: <Smile className="w-5 h-5 text-content mr-2" />,
    },
    pending: {
      text: "Hackathon lleno",
      color: "bg-warning text-content",
      icon: <Meh className="w-5 h-5 text-base-content mr-2" />,
    },
    cancelled: {
      text: "Cancelado",
      color: "bg-error text-content",
      icon: <Frown className="w-5 h-5 text-content mr-2" />,
    },
    finished: {
      text: "Hackathon finalizado",
      color: "bg-gray-200 text-gray-600",
      icon: <Check className="w-5 h-5 text-gray-500 mr-2" />,
    },
  };

  const currentStatus = statusMap[hackathon.status] || {
    text: "Estado desconocido",
    color: "bg-gray-100 text-gray-500",
    icon: <Ban className="w-5 h-5 text-gray-400 mr-2" />,
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full font-medium text-base shadow-sm ${currentStatus.color}`}
    >
      {currentStatus.icon}
      {currentStatus.text}
    </span>
  );
}

export default BadgeHackathonComponent;

import { Trophy, Activity, Users } from "lucide-react";
import { useTheme } from "@context/ThemeContext";

const cardData = [
  {
    icon: Trophy,
    title: "Estás en el puesto #3",
    description: "Ranking general del hackathon",
    buttonText: "Ver clasificación entera",
  },
  {
    icon: Activity,
    title: "Actividad reciente",
    description: "Tu equipo subió un nuevo commit hace 2 horas",
    buttonText: "Ver historial",
  },
  {
    icon: Users,
    title: "231 participantes",
    description: "Aumentó un 8% esta semana",
    buttonText: "Ver estadísticas",
  },
];

const DashboardCards = () => {
  const { isDark } = useTheme();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`card ${
              isDark ? "bg-slate-900/80" : "bg-base-200"
            } shadow-xl border border-info/10`}
          >
            <div className="card-body">
              <div className="flex items-center gap-4">
                <Icon className={`text-${card.color}`} size={32} />
                <h2 className="card-title">{card.title}</h2>
              </div>
              <p className="text-sm text-gray-500">{card.description}</p>
              <div className="card-actions justify-start mt-4">
                <button
                  className={`btn ${
                    isDark ? "btn-accent" : "btn-primary"
                  } btn-sm`}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;

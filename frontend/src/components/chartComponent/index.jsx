import React from "react";
import { useTheme } from "@context/ThemeContext";
import { useApp } from "@context/AppContext";
import { useAuth } from "@context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Frown } from "lucide-react";
import { motion } from "framer-motion";

const ChartComponent = ({ ProfileUser }) => {
  const { isDark } = useTheme();
  const { myHackathons: hackathons, allWinners } = useApp();
  const { user } = useAuth();

  const now = new Date();

  const countFinishedHackathons = () => {
    if (!hackathons || hackathons.length === 0) return 0;
    return hackathons.filter((h) => h.status === "finished").length;
  };

  const calculateTop3Count = (hackathons, winners, user) => {
    if (!hackathons || !winners || !user) return 0;

    let count = 0;

    hackathons.forEach((hack) => {
      const myTeam = hack.teams?.find((team) =>
        team.members?.some((m) => m.user?.id === user.id)
      );

      if (!myTeam) return;

      const myWinningEntry = winners.find(
        (w) => w.hackathon_id === hack.id && w.team_id === myTeam.id
      );

      if (myWinningEntry && myWinningEntry.position <= 3) {
        count++;
      }
    });

    return count;
  };

  const calculateAveragePlacement = (hackathons, winners, user) => {
    if (!hackathons || !winners || !user) return null;

    const myPlacements = [];

    hackathons.forEach((hack) => {
      // Encontrar mi equipo en este hackathon
      const myTeam = hack.teams?.find((team) =>
        team.members?.some((m) => m.user?.id === user.id)
      );

      if (!myTeam) return;

      // Buscar si ese equipo fue ganador
      const myWinningEntry = winners.find(
        (w) => w.hackathon_id === hack.id && w.team_id === myTeam.id
      );

      if (myWinningEntry) {
        myPlacements.push(myWinningEntry.position);
      }
    });

    if (myPlacements.length === 0) return null;

    const total = myPlacements.reduce((sum, pos) => sum + pos, 0);
    const avg = total / myPlacements.length;

    return avg.toFixed(1);
  };

  const generateParticipationData = () => {
    if (!hackathons) return [];

    const counts = {};

    hackathons.forEach((h) => {
      if (h.status === "pending" || !h.end_date) return;

      const endDate = new Date(h.end_date);
      const year = endDate.getFullYear();
      const month = endDate.getMonth();
      const key = `${year}-${month}`;

      counts[key] = (counts[key] || 0) + 1;
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      data.push({
        month: months[date.getMonth()],
        hackathons: counts[key] || 0,
      });
    }

    return data;
  };

  const totalFinishedHackathons = countFinishedHackathons();
  const participationData = generateParticipationData();
  const avgPlacement = calculateAveragePlacement(
    hackathons,
    allWinners,
    ProfileUser
  );
  const top3Count = calculateTop3Count(hackathons, allWinners, ProfileUser);

  return (
    <motion.div
      className="mt-8 p-6 bg-base-200 rounded-xl shadow space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="text-xl font-bold">Estadísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-base-300 rounded-box shadow">
          <p className="text-lg font-semibold">{totalFinishedHackathons}</p>
          <p className="text-sm text-muted">Hackathons Completados</p>
        </div>
        <div className="p-4 bg-base-300 rounded-box shadow">
          <p className="text-lg font-semibold">
            {avgPlacement != null ? `#${avgPlacement}` : "0"}
          </p>
          <p className="text-sm text-muted">Promedio de Posición</p>
        </div>
        <div className="p-4 bg-base-300 rounded-box shadow">
          <p className="text-lg font-semibold">{top3Count}</p>
          <p className="text-sm text-muted">Veces en Top 3</p>
        </div>
      </div>

      <div style={{ height: "300px", width: "100%", position: "relative" }}>
        {participationData.every((d) => d.hackathons === 0) ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: isDark ? "#ccc" : "#666",
              fontSize: "1.2rem",
              fontWeight: "500",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "0.5rem",
            }}
          >
            <Frown className="w-10 h-10" />
            No hubo participación
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={participationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="hackathons"
                fill={isDark ? "#9a031e" : "#0077b6"}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ChartComponent;

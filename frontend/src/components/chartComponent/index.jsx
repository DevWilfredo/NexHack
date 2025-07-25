import React from "react";
import { useTheme } from "@context/ThemeContext";
import { useApp } from "../../context/AppContext"; // Ajusta la ruta
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const hackathonStatsStatic = {
  avgPlacement: 4.2,
  top10Percentage: 87,
};
import { Frown } from 'lucide-react';

const ChartComponent = () => {
  const { isDark } = useTheme();
  const { myHackathons: hackathons } = useApp();

  // Obtener mes y año actual para poder manejar meses anteriores
  const now = new Date();
  const currentYear = now.getFullYear();

  // Función para contar hackathons del mes pasado con status distinto de pending
  const countLastMonthHackathons = () => {
    if (!hackathons || hackathons.length === 0) return 0;

    const lastMonth = now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;

    return hackathons.filter((h) => {
      if (h.status === "pending") return false;
      if (!h.end_date) return false;

      const endDate = new Date(h.end_date);
      return endDate.getMonth() === lastMonth && endDate.getFullYear() === lastMonthYear;
    }).length;
  };

  // Crear array con 12 meses para mostrar en el gráfico
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Generar data para el gráfico de los últimos 7 meses (o los meses que quieras)
  const generateParticipationData = () => {
    if (!hackathons) return [];

    // Preparamos un contador por mes-año (clave: YYYY-MM)
    const counts = {};

    hackathons.forEach((h) => {
      if (h.status === "pending" || !h.end_date) return;

      const endDate = new Date(h.end_date);
      const year = endDate.getFullYear();
      const month = endDate.getMonth(); // 0-11
      const key = `${year}-${month}`;

      counts[key] = (counts[key] || 0) + 1;
    });

    // Queremos datos para últimos 7 meses (puedes ajustar)
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

  const participationData = generateParticipationData();
  const totalHackathonsLastMonth = countLastMonthHackathons();

  return (
    <div className="mt-8 p-6 bg-base-200 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold">Estadísticas Mensuales</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-base-300 rounded-box shadow">
          <p className="text-lg font-semibold">{totalHackathonsLastMonth}</p>
          <p className="text-sm text-muted">Hackathons del mes pasado</p>
        </div>
        <div className="p-4 bg-base-300 rounded-box shadow">
          <p className="text-lg font-semibold">
            #{hackathonStatsStatic.avgPlacement}
          </p>
          <p className="text-sm text-muted">Promedio de Posición</p>
        </div>
        <div className="p-4 bg-base-300 rounded-box shadow">
          <p className="text-lg font-semibold">
            {hackathonStatsStatic.top10Percentage}%
          </p>
          <p className="text-sm text-muted">Top 10 ranking obtenidos</p>
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
    </div>
  );
};

export default ChartComponent;

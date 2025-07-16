import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const hackathonStats = {
  totalHackathons: 24,
  avgPlacement: 4.2,
  top10Percentage: 87,
};

const participationData = [
  { month: "Jan", hackathons: 2 },
  { month: "Feb", hackathons: 3 },
  { month: "Mar", hackathons: 1 },
  { month: "Apr", hackathons: 4 },
  { month: "May", hackathons: 3 },
  { month: "Jun", hackathons: 5 },
  { month: "Jul", hackathons: 6 },
];

const ChartComponent = () => {
  return (
    <div className="mt-8 p-6 bg-base-200 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold">Hackathon Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-base-100 rounded-box shadow">
          <p className="text-lg font-semibold">
            {hackathonStats.totalHackathons}
          </p>
          <p className="text-sm text-muted">Total Hackathons</p>
        </div>
        <div className="p-4 bg-base-100 rounded-box shadow">
          <p className="text-lg font-semibold">
            #{hackathonStats.avgPlacement}
          </p>
          <p className="text-sm text-muted">Avg. Placement</p>
        </div>
        <div className="p-4 bg-base-100 rounded-box shadow">
          <p className="text-lg font-semibold">
            {hackathonStats.top10Percentage}%
          </p>
          <p className="text-sm text-muted">Top 10 Finishes</p>
        </div>
      </div>

      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={participationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="hackathons" fill="#9A031E" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;

"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function MetricsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const res = await api.get("/api/metrics");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading metrics...</p>;
  if (error) return <p>Error loading metrics</p>;

  // Chart data for label counts
  const chartData = Object.entries(data.labelCounts || {}).map(
    ([label, value]) => ({ name: label, value })
  );

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  return (
    <div className="p-6 space-y-8 text-black">
      <h1 className="text-2xl font-bold">Metrics</h1>

      {/* Stat cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Total Scans</h2>
          <p className="text-3xl font-bold text-blue-600">{data.totalScans}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Accuracy Rate</h2>
          <p className="text-3xl font-bold text-green-600">
            {data.accuracyRate !== null
              ? `${(data.accuracyRate * 100).toFixed(2)}%`
              : "N/A"}
          </p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">Avg Confidence</h2>
          <p className="text-3xl font-bold text-purple-600">
            {data.avgConfidence !== null
              ? `${(data.avgConfidence * 100).toFixed(2)}%`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="p-6 bg-white rounded-lg shadow w-full md:w-1/2">
        <h2 className="text-lg font-semibold mb-4">Label Distribution</h2>
        {chartData.length > 0 ? (
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p>No data yet</p>
        )}
      </div>
    </div>
  );
}

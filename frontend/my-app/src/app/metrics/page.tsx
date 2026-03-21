"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardBody, CardHeader, Skeleton } from "@/components/ui";

export default function MetricsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const res = await api.get("/api/metrics");
      return res.data;
    },
  });

  if (error) {
    return (
      <div className="container-safe py-8">
        <div className="bg-danger-50 dark:bg-danger-900/30 border-l-4 border-danger-500 p-4 rounded-lg">
          <p className="text-danger-800 dark:text-danger-200">Error loading metrics. Please try again.</p>
        </div>
      </div>
    );
  }

  const chartData = Object.entries(data?.labelCounts || {}).map(([label, value]) => ({
    name: label,
    value: value as number,
  }));

  const COLORS = ["#0ea5e9", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="container-safe py-6 md:py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
          Analytics & Metrics
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Comprehensive overview of your predictions and performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Total Scans */}
        <Card className="border-0 hover:shadow-lg transition-shadow">
          <CardBody className="space-y-2">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Scans</p>
            {isLoading ? (
              <Skeleton width={100} height={40} />
            ) : (
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {data?.totalScans || 0}
              </p>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              All-time predictions made
            </p>
          </CardBody>
        </Card>

        {/* Accuracy Rate */}
        <Card className="border-0 hover:shadow-lg transition-shadow">
          <CardBody className="space-y-2">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Accuracy Rate</p>
            {isLoading ? (
              <Skeleton width={100} height={40} />
            ) : (
              <p className="text-4xl font-bold text-success-600 dark:text-success-400">
                {data?.accuracyRate !== null ? `${(data.accuracyRate * 100).toFixed(1)}%` : "N/A"}
              </p>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              Based on user feedback
            </p>
          </CardBody>
        </Card>

        {/* Avg Confidence */}
        <Card className="border-0 hover:shadow-lg transition-shadow">
          <CardBody className="space-y-2">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Avg Confidence</p>
            {isLoading ? (
              <Skeleton width={100} height={40} />
            ) : (
              <p className="text-4xl font-bold text-secondary-600 dark:text-secondary-400">
                {data?.avgConfidence !== null ? `${(data.avgConfidence * 100).toFixed(1)}%` : "N/A"}
              </p>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              Average confidence level
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border-0">
          <CardHeader title="Label Distribution" subtitle="Breakdown by diagnosis type" />
          <CardBody>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton count={5} height={20} />
              </div>
            ) : chartData.length > 0 ? (
              <div className="flex justify-center w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'transparent',
                        border: 'none',
                      }}
                      formatter={(value: any) => value}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Bar Chart */}
        <Card className="border-0">
          <CardHeader title="Diagnosis Frequency" subtitle="Count by prediction type" />
          <CardBody>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton count={5} height={20} />
              </div>
            ) : chartData.length > 0 ? (
              <div className="flex justify-center w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="name"
                      stroke="currentColor"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      stroke="currentColor"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'transparent',
                        border: 'none',
                      }}
                    />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card className="border-0">
        <CardHeader title="Detailed Breakdown" />
        <CardBody>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton count={5} height={40} />
            </div>
          ) : chartData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chartData.map((item, index) => (
                <div
                  key={item.name}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.value} prediction{item.value !== 1 ? "s" : ""}
                    </p>
                    <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(item.value / Math.max(...chartData.map((d) => d.value))) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">
                    {((item.value / (data?.totalScans || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400">No data available yet</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

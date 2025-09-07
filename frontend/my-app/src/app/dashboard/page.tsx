"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  return (
    <AuthGuard>
      <div className="p-6 grid gap-6 md:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-bold text-black">Total Scans</h2>
          <p className="text-2xl text-black">{data.totalScans}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-bold text-black text-black">Accurate Feedback</h2>
          <p className="text-2xl text-black">{data.feedback.accurate}</p>
        </div>
      </div>
    </AuthGuard>
  );
}

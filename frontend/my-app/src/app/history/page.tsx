"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const queryClient = useQueryClient();

  // Fetch history from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await api.get("/api/history");
      return res.data.history; // backend returns { history: [...] }
    },
  });

  // Mutation for sending feedback
  const feedbackMutation = useMutation({
    mutationFn: async ({
      historyId,
      isAccurate,
    }: {
      historyId: string;
      isAccurate: boolean;
    }) => {
      await api.post("/api/feedback", { historyId, isAccurate });
    },
    onSuccess: () => {
      toast.success("Feedback submitted!");
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading history</p>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-6">Prediction History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Prediction</th>
              <th className="p-3 border-b">Confidence</th>
              <th className="p-3 border-b">Timestamp</th>
              <th className="p-3 border-b">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: any) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">
                  {item.imagePath || "N/A"}
                </td>
                <td className="p-3">{item.prediction}</td>
                <td className="p-3">{(item.confidence * 100).toFixed(2)}%</td>
                <td className="p-3">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() =>
                      feedbackMutation.mutate({
                        historyId: item._id,
                        isAccurate: true,
                      })
                    }
                    className="px-3 py-1 bg-green-600 text-white rounded mr-2 hover:bg-green-700 transition"
                  >
                    ✅ Accurate
                  </button>
                  <button
                    onClick={() =>
                      feedbackMutation.mutate({
                        historyId: item._id,
                        isAccurate: false,
                      })
                    }
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    ❌ Inaccurate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

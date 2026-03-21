"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Card, CardBody, CardHeader, Button, Badge, Skeleton } from "@/components/ui";
import { useState, useMemo } from "react";

interface HistoryItem {
  _id: string;
  imagePath: string;
  prediction: string;
  confidence: number;
  timestamp: string;
  feedbackGiven?: boolean;
  feedbackAccurate?: boolean;
}

type SortField = "timestamp" | "prediction" | "confidence";
type SortOrder = "asc" | "desc";

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch history from backend
  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await api.get("/api/history");
      return res.data.history || [];
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

  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter((item: HistoryItem) =>
      item.prediction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.imagePath.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a: HistoryItem, b: HistoryItem) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case "timestamp":
          aVal = new Date(a.timestamp).getTime();
          bVal = new Date(b.timestamp).getTime();
          break;
        case "prediction":
          aVal = a.prediction;
          bVal = b.prediction;
          break;
        case "confidence":
          aVal = a.confidence;
          bVal = b.confidence;
          break;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    const percent = confidence * 100;
    return percent >= 80 ? "success" : percent >= 60 ? "warning" : "danger";
  };

  if (error) {
    return (
      <div className="container-safe py-8">
        <div className="bg-danger-50 dark:bg-danger-900/30 border-l-4 border-danger-500 p-4 rounded-lg">
          <p className="text-danger-800 dark:text-danger-200">Error loading history. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-safe py-6 md:py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
          Prediction History
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          View all your past predictions and provide feedback
        </p>
      </div>

      <Card className="border-0">
        <CardHeader title="All Predictions" subtitle={`${filteredData.length} total`} />
        <CardBody className="space-y-4">
          {/* Search and controls */}
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by diagnosis or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                flex-1 px-4 py-2 rounded-lg border-2
                border-neutral-200 dark:border-neutral-700
                bg-white dark:bg-neutral-800
                text-neutral-900 dark:text-white
                placeholder-neutral-500 dark:placeholder-neutral-400
                focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                dark:focus:ring-primary-900/30
                transition-colors
              "
              aria-label="Search history"
            />
            {filteredData.length > 0 && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
                {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800 border-b-2 border-neutral-200 dark:border-neutral-700">
                  <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">
                    <button
                      onClick={() => toggleSort("prediction")}
                      className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                      aria-label="Sort by prediction"
                    >
                      Diagnosis
                      {sortField === "prediction" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">
                    <button
                      onClick={() => toggleSort("confidence")}
                      className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                      aria-label="Sort by confidence"
                    >
                      Confidence
                      {sortField === "confidence" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">
                    <button
                      onClick={() => toggleSort("timestamp")}
                      className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                      aria-label="Sort by date"
                    >
                      Date
                      {sortField === "timestamp" && (
                        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6">
                      <div className="space-y-3">
                        <Skeleton count={5} height={40} />
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        {data?.length === 0 ? "No predictions yet. Upload an image to get started." : "No results match your search."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item: HistoryItem) => (
                    <tr
                      key={item._id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {item.prediction}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant={getConfidenceBadgeColor(item.confidence)}
                          size="sm"
                        >
                          {(item.confidence * 100).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {new Date(item.timestamp).toLocaleDateString()}{" "}
                        <span className="text-xs">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              feedbackMutation.mutate({
                                historyId: item._id,
                                isAccurate: true,
                              })
                            }
                            disabled={feedbackMutation.isPending}
                            aria-label={`Mark ${item.prediction} as accurate`}
                          >
                            ✓
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              feedbackMutation.mutate({
                                historyId: item._id,
                                isAccurate: false,
                              })
                            }
                            disabled={feedbackMutation.isPending}
                            aria-label={`Mark ${item.prediction} as inaccurate`}
                          >
                            ✕
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton count={5} height={120} />
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-500 dark:text-neutral-400">
                  {data?.length === 0 ? "No predictions yet. Upload an image to get started." : "No results match your search."}
                </p>
              </div>
            ) : (
              filteredData.map((item: HistoryItem) => (
                <Card key={item._id} className="border-0">
                  <CardBody className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">
                          {item.prediction}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {new Date(item.timestamp).toLocaleDateString()}{" "}
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge
                        variant={getConfidenceBadgeColor(item.confidence)}
                        size="md"
                      >
                        {(item.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          feedbackMutation.mutate({
                            historyId: item._id,
                            isAccurate: true,
                          })
                        }
                        disabled={feedbackMutation.isPending}
                        className="flex-1"
                        aria-label="Mark as accurate"
                      >
                        Accurate
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          feedbackMutation.mutate({
                            historyId: item._id,
                            isAccurate: false,
                          })
                        }
                        disabled={feedbackMutation.isPending}
                        className="flex-1"
                        aria-label="Mark as inaccurate"
                      >
                        Inaccurate
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

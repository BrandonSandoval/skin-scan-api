"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import AuthGuard from "@/components/AuthGuard";
import { Card, CardBody, CardHeader, Skeleton } from "@/components/ui";
import Link from "next/link";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard");
      return res.data;
    },
  });

  if (error) {
    return (
      <div className="container-safe py-8">
        <div className="bg-danger-50 dark:bg-danger-900/30 border-l-4 border-danger-500 p-4 rounded-lg">
          <p className="text-danger-800 dark:text-danger-200">Error loading dashboard. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="container-safe py-6 md:py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Welcome back! Here's your analysis overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Scans */}
          <Card className="border-0 hover:shadow-lg transition-shadow">
            <CardBody className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Scans</p>
                  {isLoading ? (
                    <Skeleton width={80} height={32} />
                  ) : (
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      {data?.totalScans || 0}
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">All-time predictions</p>
            </CardBody>
          </Card>

          {/* Accurate Feedback */}
          <Card className="border-0 hover:shadow-lg transition-shadow">
            <CardBody className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Accurate</p>
                  {isLoading ? (
                    <Skeleton width={80} height={32} />
                  ) : (
                    <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                      {data?.feedback?.accurate || 0}
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">User-confirmed accurate</p>
            </CardBody>
          </Card>

          {/* Inaccurate Feedback */}
          <Card className="border-0 hover:shadow-lg transition-shadow">
            <CardBody className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Inaccurate</p>
                  {isLoading ? (
                    <Skeleton width={80} height={32} />
                  ) : (
                    <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">
                      {data?.feedback?.inaccurate || 0}
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 bg-danger-100 dark:bg-danger-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-danger-600 dark:text-danger-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">User-marked inaccurate</p>
            </CardBody>
          </Card>

          {/* Accuracy Rate */}
          <Card className="border-0 hover:shadow-lg transition-shadow">
            <CardBody className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Accuracy Rate</p>
                  {isLoading ? (
                    <Skeleton width={80} height={32} />
                  ) : (
                    <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                      {data?.feedback?.total ? ((data.feedback.accurate / data.feedback.total) * 100).toFixed(1) : 0}%
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">Based on feedback</p>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/upload" className="group">
            <Card className="border-0 hover:shadow-lg transition-shadow h-full">
              <CardBody className="flex flex-col items-center text-center space-y-3 py-8">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">New Analysis</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Upload and analyze image</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/history" className="group">
            <Card className="border-0 hover:shadow-lg transition-shadow h-full">
              <CardBody className="flex flex-col items-center text-center space-y-3 py-8">
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">View History</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">See past predictions</p>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/metrics" className="group">
            <Card className="border-0 hover:shadow-lg transition-shadow h-full">
              <CardBody className="flex flex-col items-center text-center space-y-3 py-8">
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white">View Metrics</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Analytics and statistics</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
}

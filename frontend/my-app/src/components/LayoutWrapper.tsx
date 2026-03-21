"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
      // Not logged in → redirect to login
      router.replace("/login");
    } else if (token && PUBLIC_ROUTES.includes(pathname)) {
      // Already logged in → block login/register
      router.replace("/dashboard");
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <svg
              className="absolute inset-0 animate-spin text-primary-600 dark:text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Add padding for mobile to account for fixed sidebar toggle button */}
        <div className="md:p-0 pt-16 md:pt-0">
          <Providers>{children}</Providers>
        </div>
      </main>
    </div>
  );
}

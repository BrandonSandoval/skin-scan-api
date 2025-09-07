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
    return <p className="p-6">Checking authentication...</p>;
  }

  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 p-8">
        <Providers>{children}</Providers>
      </main>
    </div>
  );
}

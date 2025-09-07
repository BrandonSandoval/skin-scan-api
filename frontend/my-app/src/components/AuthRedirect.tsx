"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard"); // already logged in → go to dashboard
    }
  }, [router]);

  return <>{children}</>;
}

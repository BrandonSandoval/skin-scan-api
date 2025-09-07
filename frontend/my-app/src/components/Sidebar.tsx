"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col space-y-6">
      <h1 className="text-xl font-bold text-blue-600">SkinScan</h1>
      <nav className="flex flex-col space-y-3">
        <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition">
          Dashboard
        </Link>
        <Link href="/upload" className="px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition">
          Upload
        </Link>
        <Link href="/history" className="px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition">
          History
        </Link>
        <Link href="/metrics" className="px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition">
          Metrics
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
      >
        Logout
      </button>
    </aside>
  );
}

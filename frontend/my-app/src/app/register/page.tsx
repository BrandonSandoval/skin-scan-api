"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthRedirect from "@/components/AuthRedirect";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", { email, password });
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err: any) {
      console.error("Register error:", err?.response?.data);
      toast.error(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-black">Register</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Switch to login */}
          <p className="mt-4 text-center text-sm text-black">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </AuthRedirect>
  );
}

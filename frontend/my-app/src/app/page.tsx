import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 backdrop-blur-sm sticky top-0 z-40">
        <nav className="container-safe h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            SkinScan
          </Link>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost" size="md">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container-safe py-12 md:py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
                AI-Powered Skin{" "}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Lesion Analysis
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300">
                Advanced machine learning to help identify potential skin conditions from photos. Fast, accurate, and accessible.
              </p>
            </div>

            {/* Features list */}
            <ul className="space-y-3">
              {[
                { icon: "⚡", title: "Instant Analysis", desc: "Get results in seconds" },
                { icon: "🎯", title: "High Accuracy", desc: "AI-powered predictions" },
                { icon: "🔒", title: "Secure & Private", desc: "Your data stays safe" },
                { icon: "📊", title: "Detailed Insights", desc: "Track your predictions" },
              ].map((feature) => (
                <li key={feature.title} className="flex gap-3 items-start">
                  <span className="text-2xl mt-1">{feature.icon}</span>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">{feature.title}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/register" className="flex-1 sm:flex-none">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login" className="flex-1 sm:flex-none">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl flex items-center justify-center p-8">
              <svg
                className="w-full h-full text-primary-600 dark:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 mt-12">
        <div className="container-safe py-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>© 2024 SkinScan. Empowering healthcare with AI.</p>
        </div>
      </footer>
    </div>
  );
}

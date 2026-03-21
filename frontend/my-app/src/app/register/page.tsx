"use client";

import { useState, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthRedirect from "@/components/AuthRedirect";
import Link from "next/link";
import { Button, Input, Alert, Card, CardBody, Badge } from "@/components/ui";

interface FormErrors {
  email?: string;
  password?: string;
}

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  requirements: {
    label: string;
    met: boolean;
  }[];
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  // Password strength calculation
  const passwordStrength = useMemo((): PasswordStrength => {
    const requirements = [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Lowercase letter", met: /[a-z]/.test(password) },
      { label: "Number", met: /\d/.test(password) },
      { label: "Special character", met: /[!@#$%^&*]/.test(password) },
    ];

    const metCount = requirements.filter((r) => r.met).length;

    return {
      score: metCount,
      label: metCount <= 1 ? "Weak" : metCount <= 2 ? "Fair" : metCount <= 3 ? "Good" : "Strong",
      color:
        metCount <= 1
          ? "danger"
          : metCount <= 2
            ? "warning"
            : metCount <= 3
              ? "success"
              : "success",
      requirements,
    };
  }, [password]);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain a number";
    }

    if (password !== confirmPassword) {
      newErrors.password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/register", { email, password });
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMessage);
      if (err?.response?.status === 409) {
        setErrors({ email: "Email is already registered. Please log in instead." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800 px-4 py-12">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardBody className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary-600 to-secondary-400 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Create Account</h1>
              <p className="text-neutral-600 dark:text-neutral-400">Join SkinScan to get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                error={errors.email}
                required
                aria-required="true"
                autoComplete="email"
                autoFocus
              />

              <div className="space-y-2">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  error={errors.password}
                  required
                  aria-required="true"
                  autoComplete="new-password"
                />

                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-2 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Password Strength:</span>
                      <Badge variant={passwordStrength.color as any} size="sm">
                        {passwordStrength.label}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 bg-gradient-to-r ${
                          passwordStrength.score <= 1
                            ? "from-danger-500 to-danger-600 w-1/4"
                            : passwordStrength.score <= 2
                              ? "from-warning-500 to-warning-600 w-1/2"
                              : passwordStrength.score <= 3
                                ? "from-success-500 to-success-600 w-3/4"
                                : "from-success-600 to-success-700 w-full"
                        }`}
                      />
                    </div>

                    {/* Requirements checklist */}
                    <ul className="space-y-1 text-xs">
                      {passwordStrength.requirements.map((req) => (
                        <li key={req.label} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <svg
                            className={`w-4 h-4 ${req.met ? "text-success-600" : "text-neutral-400"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            {req.met ? (
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            ) : (
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                          </svg>
                          <span>{req.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.password && password === e.target.value) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                error={password !== confirmPassword && confirmPassword ? "Passwords do not match" : undefined}
                required
                aria-required="true"
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full"
                aria-busy={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300 dark:border-neutral-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500">Already have an account?</span>
              </div>
            </div>

            {/* Login link */}
            <Link href="/login" className="block">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full"
              >
                Sign In
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </AuthRedirect>
  );
}

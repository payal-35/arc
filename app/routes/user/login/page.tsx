"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { AlertCircle, ArrowLeft, Mail, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";

import { ModeToggle } from "~/components/mode-toggle";

import { ARCLogo } from "~/components/arc-logo";
import { motion } from "framer-motion";

// Dummy translation function since no LanguageProvider
const t = (key: string) => {
  const translations: Record<string, string> = {
    "User Login": "User Login",
    "Email Address": "Email Address",
    Password: "Password",
    "Forgot Password?": "Forgot Password?",
    "auth.signin.loading": "Signing in...",
    "auth.signin": "Sign In",
    "Don't have an account?": "Don't have an account?",
    "Sign Up": "Sign Up",
  };
  return translations[key] || key;
};

export default function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    /*
    try {
      const response = await fetch("/api/user/login", {  // changed API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      // Redirect to user dashboard
      navigate("/dashboard");  // changed redirect path
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
    */

    // Simulate loading and success redirect
    setTimeout(() => {
      setLoading(false);
      navigate("/user/dashboard"); 
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-purple-950/30 dark:via-background dark:to-pink-950/30 p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ModeToggle />
      </div>

      <Link
        to="/auth"
        className="absolute top-4 left-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Back to auth options"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Back</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <ARCLogo />
        </div>

        <Card className="border-2 border-purple-200 dark:border-purple-900 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-violet-500"></div>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-2xl font-bold">{t("User Login")}</CardTitle>
            </div>
            <CardDescription className="text-center">
              Sign in to access your account and services
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  {t("Email Address")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500"
                  aria-describedby="email-description"
                />
                <p id="email-description" className="sr-only">
                  Enter your email address
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    {t("Password")}
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
                    aria-label="Forgot password"
                  >
                    {t("Forgot Password?")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500"
                  aria-describedby="password-description"
                />
                <p id="password-description" className="sr-only">
                  Enter your password
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full h-10 transition-all duration-300 bg-gradient-to-r from-purple-500 to-violet-500 hover:opacity-90 text-white"
                disabled={loading}
                aria-live="polite"
              >
                {loading ? t("auth.signin.loading") : t("auth.signin")}
              </Button>
              <div className="text-center text-sm">
                {t("Don't have an account?")}{" "}
                <Link
                  to="/signup"
                  className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
                >
                  {t("Sign Up")}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{" "}
            <Link to="#" className="text-purple-500 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-purple-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

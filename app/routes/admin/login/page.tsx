import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ARCLogo } from "~/components/arc-logo";
import { ModeToggle } from "~/components/mode-toggle";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle, ArrowLeft, Mail, Lock, Building2 } from "lucide-react";
import { motion } from "framer-motion";

// Translation stub
function t(str: string) {
  return str;
}

// ✅ Handles login server-side in this file (no external API route needed)
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch("http://183.83.220.58:20021/api/v1/auth/organization/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return json({ error: errorData.message || "Invalid credentials" }, { status: 400 });
  }

  // Optional: store token or headers/cookies here
  return redirect("/admin/dashboard");
};

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();

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

        <div className="border-2 border-purple-200 dark:border-purple-900 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-violet-500"></div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              <h2 className="text-2xl font-bold">{t("Admin Login")}</h2>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Sign in to manage your organization's DPDP Act 2023 compliance
            </p>

            {actionData?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{actionData.error}</AlertDescription>
              </Alert>
            )}

            {/* ✅ Remix handles the POST and redirects */}
            <Form method="post" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  {t("Email Address")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@example.com"
                  className="h-10 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    {t("Password")}
                  </label>
                  <Link
                    to="/admin/forgot-password"
                    className="text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
                  >
                    {t("Forgot Password?")}
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="h-10 border-purple-200 dark:border-purple-900 focus:border-purple-500 dark:focus:border-purple-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 transition-all duration-300 bg-gradient-to-r from-purple-500 to-violet-500 hover:opacity-90 text-white"
              >
                {t("Sign In")}
              </Button>
            </Form>

            <div className="text-center text-sm">
              {t("Don't have an account?")}{" "}
              <Link
                to="/admin/signup"
                className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
              >
                {t("Sign Up")}
              </Link>
            </div>
          </div>
        </div>

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

import React from "react";
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
import {
  ArrowRight,
  Building2,
  User,
  Shield,
  FileText,
  Lock,
  Database,
} from "lucide-react";

import { ModeToggle } from "~/components/mode-toggle";

import { ARCLogo } from "~/components/arc-logo";
import { motion } from "framer-motion";

export default function AuthPage() {
  const navigate = useNavigate();
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-background dark:to-purple-950/30 p-4">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-pink-200/20 to-purple-300/20 dark:from-pink-900/20 dark:to-purple-800/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-indigo-200/20 to-blue-300/20 dark:from-indigo-900/20 dark:to-blue-800/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        
        <ModeToggle />
      </div>

      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Back to home"
      >
        <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <ARCLogo size="large" />
          </div>
          <h2 className="text-2xl font-medium text-black dark:text-white">
  Automate Regulations & Consents
</h2>

          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            DPDP Act 2023 compliant consent management platform for organizations
            and individuals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual Users Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-indigo-200 dark:border-indigo-900 shadow-lg overflow-hidden h-full">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <User className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Individual Users</CardTitle>
                </div>
                <CardDescription>
                  For individuals who want to manage their data privacy rights under DPDP Act 2023
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mt-1">
                      <Shield className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Protect Your Data Rights</h3>
                      <p className="text-sm text-muted-foreground">
                        Exercise your rights to access, correct, and delete your personal data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mt-1">
                      <Lock className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Consent Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Control how your data is used with granular consent preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mt-1">
                      <FileText className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Transparency Dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        View which organizations have your data and how it's being processed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button
                    className="w-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 text-white"
                    onClick={() => navigate("/user/login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                    onClick={() => navigate("/user/signup")}
                  >
                    Create Account
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Organizations Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-2 border-purple-200 dark:border-purple-900 shadow-lg overflow-hidden h-full">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Building2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Organizations</CardTitle>
                </div>
                <CardDescription>
                  For businesses that need to comply with DPDP Act 2023 and manage user consents
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mt-1">
                      <Shield className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">DPDP Act 2023 Compliance</h3>
                      <p className="text-sm text-muted-foreground">
                        Automated tools to ensure compliance with India's data protection regulations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mt-1">
                      <Database className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Data Processing Records</h3>
                      <p className="text-sm text-muted-foreground">
                        Maintain comprehensive records of processing activities as required by law
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mt-1">
                      <FileText className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Consent Management System</h3>
                      <p className="text-sm text-muted-foreground">
                        Collect, store, and manage valid consent in compliance with DPDP requirements
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button
                    className="w-full transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
                    onClick={() => navigate("/admin/login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700"
                    onClick={() => navigate("/admin/signup")}
                  >
                    Create Account
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10 text-muted-foreground text-sm"
        >
          <p>© 2023 Automate Regulations & Consents. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}

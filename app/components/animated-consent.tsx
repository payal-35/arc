"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Check, X, Shield, Lock } from "lucide-react"

export function AnimatedConsent() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full bg-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative w-full h-full bg-card rounded-lg shadow-lg border-2 border-primary/20 overflow-hidden">
          {/* Header */}
          <div className="bg-primary/10 p-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">ConsentManager</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Lock className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-sm">Secure & Compliant</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <h3 className="text-xl font-bold">We Value Your Privacy</h3>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to provide you with the best experience on our website,
                    analyze traffic, and show you personalized content.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-primary text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Accept All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="border border-primary/50 text-primary py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    >
                      Customize
                    </motion.button>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h3 className="text-xl font-bold">Customize Your Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Essential Cookies</p>
                        <p className="text-sm text-muted-foreground">Required for the website to function</p>
                      </div>
                      <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">Required</div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">Analytics Cookies</p>
                        <p className="text-sm text-muted-foreground">Help us improve our website</p>
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                        className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer"
                      >
                        <motion.div className="absolute top-0.5 left-0.5 w-4 h-4 bg-primary rounded-full" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">Marketing Cookies</p>
                        <p className="text-sm text-muted-foreground">Used to show relevant ads</p>
                      </div>
                      <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-muted-foreground rounded-full" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="border border-primary/50 text-primary py-2 px-4 rounded-md"
                    >
                      Save Preferences
                    </motion.button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h3 className="text-xl font-bold">Manage Your Data</h3>
                  <p className="text-muted-foreground">
                    You have the right to access, correct, or delete your personal data at any time.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <motion.div whileHover={{ scale: 1.05 }} className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Download Your Data</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get a copy of all data we have collected about you.
                      </p>
                      <button className="text-primary text-sm font-medium">Request Data</button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} className="border p-4 rounded-md">
                      <h4 className="font-medium mb-2">Delete Your Data</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Permanently remove all your personal information.
                      </p>
                      <button className="text-destructive text-sm font-medium">Request Deletion</button>
                    </motion.div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }}>
                      <Check className="h-6 w-6 text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold">Preferences Saved!</h3>
                  </div>

                  <p className="text-muted-foreground">
                    Your consent preferences have been saved. You can change these settings at any time by clicking on
                    the "Cookie Settings" link in the footer.
                  </p>

                  <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Your Privacy Summary</p>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        <span>Essential Cookies: Enabled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        <span>Analytics Cookies: Enabled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <X className="h-3 w-3 text-destructive" />
                        <span>Marketing Cookies: Disabled</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Settings, BarChart3, Shield } from "lucide-react";

export default function AnimatedProcess() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      title: "Seamless Integration",
      icon: <Shield className="h-6 w-6 text-primary" />,
      description: "Add a simple code snippet to your website",
      code: '<script src="consentmanager.js"></script>',
    },
    {
      title: "Customized Consent Flows",
      icon: <Settings className="h-6 w-6 text-primary" />,
      description: "Configure your consent preferences",
      items: [
        "Brand colors",
        "Language options",
        "Consent categories",
        "Regional settings",
      ],
    },
    {
      title: "Automated Compliance",
      icon: <Check className="h-6 w-6 text-primary" />,
      description: "Our system handles regulatory updates",
      regions: ["GDPR", "CCPA", "LGPD", "PIPEDA", "POPIA"],
    },
    {
      title: "Comprehensive Reporting",
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      description: "Access detailed analytics and reports",
      chart: [25, 65, 45, 80],
    },
  ];

  const barColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
  ];

  return (
    <div className="w-full h-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative w-full h-full bg-card rounded-lg shadow-lg border-2 border-primary/20 overflow-hidden p-6">
          {/* Step Indicators */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    index <= step
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < step ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${(step + 1) * 25}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
            className="min-h-[300px]"
          >
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1 }}
                className="p-2 bg-primary/10 rounded-full"
              >
                {steps[step].icon}
              </motion.div>
              <h3 className="text-xl font-bold">{steps[step].title}</h3>
            </div>

            <p className="text-muted-foreground mb-6">
              {steps[step].description}
            </p>

            {/* Step 0: Code Block */}
            {step === 0 && (
              <div className="bg-muted/50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <motion.div
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {steps[step].code}
                </motion.div>
                <motion.div
                  animate={{ opacity: [0, 1] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-2 text-muted-foreground"
                >
                  {/* eslint-disable-next-line */}
                  // That's it! ConsentManager is now active on your site
                </motion.div>
              </div>
            )}

            {/* Step 1: Consent Items */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {steps[step].items?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-muted/30 p-3 rounded-md border flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full bg-primary/70" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Step 2: Region Tags */}
            {step === 2 && (
              <div className="flex flex-wrap gap-2">
                {steps[step].regions?.map((region, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {region}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="bg-muted/50 text-muted-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                >
                  <span>Auto-updates</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* Step 3: Animated Chart */}
            {step === 3 && (
              <div className="h-[200px] flex items-end justify-between gap-4 pb-8 pt-4">
                {steps[step].chart?.map((height, index) => (
                  <motion.div
                    key={index}
                    className={`${barColors[index]} w-16 rounded-t-md relative group cursor-pointer`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ height: `${height}%`, transformOrigin: "bottom" }}
                  >
                    {/* Tooltip: always visible on hover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100"
                    >
                      {height}%
                    </motion.div>

                    {/* Label */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground"
                    >
                      {["Q1", "Q2", "Q3", "Q4"][index]}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

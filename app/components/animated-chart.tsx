"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { BarChart3 } from "lucide-react"

export function AnimatedChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  const bars = [
    { height: 60, label: "GDPR", value: "78%" },
    { height: 80, label: "CCPA", value: "92%" },
    { height: 50, label: "LGPD", value: "65%" },
    { height: 70, label: "PIPEDA", value: "85%" },
  ]

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{
          scale: [0.8, 1.1, 0.9, 1],
          opacity: [0.5, 0.8, 0.9, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="absolute inset-0 bg-primary/20 rounded-full"
      />

      <motion.div
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <BarChart3 className="h-6 w-6 text-primary" />
      </motion.div>
    </div>
  )
}

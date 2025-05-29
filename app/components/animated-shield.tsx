"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"

export function AnimatedShield() {
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
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Shield className="h-6 w-6 text-primary" />
      </motion.div>
    </div>
  )
}

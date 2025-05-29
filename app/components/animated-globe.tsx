"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"

export function AnimatedGlobe() {
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
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Globe className="h-6 w-6 text-primary" />
      </motion.div>
    </div>
  )
}

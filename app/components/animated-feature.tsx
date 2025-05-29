"use client"

import { motion } from "framer-motion"
import { FileText, Clock, CheckCircle2, RefreshCw, Settings, Lock } from "lucide-react"

interface AnimatedFeatureProps {
  icon: "form" | "lifecycle" | "compliance" | "refresh" | "settings" | "lock"
}

export function AnimatedFeature({ icon }: AnimatedFeatureProps) {
  const renderIcon = () => {
    switch (icon) {
      case "form":
        return (
          <div className="relative">
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <FileText className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              className="absolute -top-1 -right-1"
            >
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            </motion.div>
          </div>
        )
      case "lifecycle":
        return (
          <div className="relative">
            <Clock className="h-6 w-6 text-primary" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ originX: "50%", originY: "50%" }}
            >
              <div className="w-6 h-6 border-t-2 border-primary/30 rounded-full" />
            </motion.div>
          </div>
        )
      case "compliance":
        return (
          <div className="relative">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0"
            >
              <div className="w-full h-full rounded-full border-2 border-primary/30" />
            </motion.div>
          </div>
        )
      case "refresh":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <RefreshCw className="h-6 w-6 text-primary" />
          </motion.div>
        )
      case "settings":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Settings className="h-6 w-6 text-primary" />
          </motion.div>
        )
      case "lock":
        return (
          <div className="relative">
            <Lock className="h-6 w-6 text-primary" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full h-full rounded-full bg-primary/20" />
            </motion.div>
          </div>
        )
      default:
        return <FileText className="h-6 w-6 text-primary" />
    }
  }

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
      {renderIcon()}
    </div>
  )
}

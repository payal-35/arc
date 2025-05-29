"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle, Lock } from "lucide-react"
type ARCLogoProps = {
  size?: "small" | "default" | "large";
  animated?: boolean;
};

export function ARCLogo({ size = "default", animated = true }: ARCLogoProps) {
  const logoSizes = {
    small: {
      container: "w-8 h-8",
      icon: "h-4 w-4",
      text: "text-lg",
    },
    default: {
      container: "w-10 h-10",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    large: {
      container: "w-16 h-16",
      icon: "h-8 w-8",
      text: "text-3xl",
    },
  };

  const sizeClass = logoSizes[size];

  if (animated) {
    return (
      <div className="flex items-center gap-2">
        <div className={`relative ${sizeClass.container} flex items-center justify-center`}>
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div className="absolute inset-0 rounded-full bg-white dark:bg-background" style={{ margin: "2px" }} />
          <motion.div
            className="relative z-10"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Shield className={`${sizeClass.icon} text-indigo-600 dark:text-indigo-400`} />
          </motion.div>
          <motion.div
            className="absolute top-0 right-0"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4,
            }}
          >
            <CheckCircle className="h-3 w-3 text-green-500" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4,
              delay: 2,
            }}
          >
            <Lock className="h-3 w-3 text-purple-500" />
          </motion.div>
        </div>
        <motion.span
          className={`font-bold ${sizeClass.text} bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ARC
        </motion.span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClass.container} flex items-center justify-center`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="absolute inset-0 rounded-full bg-white dark:bg-background" style={{ margin: "2px" }} />
        <div className="relative z-10">
          <Shield className={`${sizeClass.icon} text-indigo-600 dark:text-indigo-400`} />
        </div>
      </div>
      <span
        className={`font-bold ${sizeClass.text} bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400`}
      >
        ARC
      </span>
    </div>
  )
}

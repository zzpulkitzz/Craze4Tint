import { motion } from "framer-motion"

export function ProgressBar({ duration }) {
  return (
    <motion.div
      className="h-1 bg-blue-500"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: duration / 1000, ease: "linear" }}
    />
  )
}


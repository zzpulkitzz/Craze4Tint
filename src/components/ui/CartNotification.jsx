import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from 'lucide-react'
import { ProgressBar } from "./ProgressBar"

export function CartNotification({ item, onClose }) {
  const [isVisible, setIsVisible] = useState(true)
  const duration = 2000 // 5 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "100%" }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, x: "100%", y: -50 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="fixed top-4 right-4 w-64 bg-white border shadow-lg rounded-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Added to Cart</h3>
              <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <img src={item.images[0].url} alt={item.title} className="w-10 h-10 rounded object-cover" />
              <p className="text-sm">{item.title}</p>
            </div>
          </div>
          <ProgressBar duration={duration} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}


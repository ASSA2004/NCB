"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [stage, setStage] = useState<"fluid" | "logo" | "moving" | "done">("fluid")

  useEffect(() => {
    const fluidTimer = setTimeout(() => setStage("logo"), 1500)
    const logoTimer = setTimeout(() => setStage("moving"), 2500)
    const moveTimer = setTimeout(() => {
      setStage("done")
      setIsLoading(false)
    }, 3500)

    return () => {
      clearTimeout(fluidTimer)
      clearTimeout(logoTimer)
      clearTimeout(moveTimer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
        >
          <div className="relative flex items-center justify-center">
            {stage === "fluid" && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0.3 }}
                animate={{
                  scale: [0.5, 0.7, 0.9, 1.1, 1],
                  opacity: [0.3, 0.6, 0.8, 0.9, 1],
                  borderRadius: ["50% 40% 60% 50%", "60% 50% 50% 60%", "50% 60% 40% 50%", "40% 50% 60% 50%", "50%"],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 bg-gradient-to-br from-primary via-accent to-primary/50 blur-sm"
              />
            )}

            {stage === "logo" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Logo text representation */}
                  <div className="text-5xl font-display font-bold text-primary">NCB</div>
                  <div className="text-sm font-medium text-muted-foreground tracking-wider">NEW CRESCENT BUILDERS</div>
                </div>
              </motion.div>
            )}

            {stage === "moving" && (
              <motion.div
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={{
                  scale: 0.4,
                  x: -window.innerWidth / 2 + 100,
                  y: -window.innerHeight / 2 + 40,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl font-display font-bold text-primary">NCB</div>
                  <div className="text-sm font-medium text-muted-foreground tracking-wider">NEW CRESCENT BUILDERS</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

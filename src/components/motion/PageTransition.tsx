"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

let hasNavigated = false;

/**
 * Soft fade between routes. Skipped on the first load so the initial paint is
 * never delayed.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const animateIn = hasNavigated && !reduce;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar pinned under the header. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      data-testid="reading-progress"
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-burgundy-600 via-rose-400 to-rose-200"
      style={{ scaleX }}
    />
  );
}

"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * A vertical line that fills as its parent scrolls through the viewport.
 * Place inside a `relative` container.
 */
export function TimelineLine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <span ref={ref} aria-hidden="true" className={cn("absolute w-px bg-paper-100/10", className)}>
      <motion.span
        className="absolute inset-0 origin-top bg-gradient-to-b from-rose-300 via-rose-400 to-burgundy-600"
        style={{ scaleY }}
      />
    </span>
  );
}

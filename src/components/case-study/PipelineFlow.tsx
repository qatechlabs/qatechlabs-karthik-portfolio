"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { DiagramStage } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Architecture stages that light up in sequence when scrolled into view, with
 * a signal that keeps flowing through the pipeline.
 */
export function PipelineFlow({ stages }: { stages: DiagramStage[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % (stages.length + 2)), 700);
    return () => window.clearInterval(id);
  }, [inView, reduce, stages.length]);

  return (
    <figure>
      <ol ref={ref} className="grid gap-3 md:grid-flow-col md:auto-cols-fr" aria-label="Architecture stages" data-testid="pipeline">
        {stages.map((stage, index) => {
          const lit = reduce || step >= index;
          const current = step === index;
          return (
            <motion.li
              key={stage.label}
              className={cn(
                "relative rounded-xl border p-4 transition-[border-color,background-color,box-shadow] duration-500",
                lit ? "border-rose-500/40 bg-navy-850" : "border-paper-100/10 bg-navy-900/80",
                current && "shadow-[0_0_0_1px_rgba(219,173,150,0.35),0_12px_40px_-12px_rgba(201,150,126,0.45)]",
              )}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className={cn("font-mono text-[0.65rem] tracking-[0.16em] uppercase transition-colors", lit ? "text-rose-300" : "text-rose-400/70")}>
                {String(index + 1).padStart(2, "0")} · {stage.label}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-paper-100">
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {index < stages.length - 1 ? (
                <span aria-hidden="true" className="absolute top-1/2 -right-3 z-10 hidden h-px w-3 bg-paper-100/15 md:block">
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 bg-rose-400 transition-[width] duration-500",
                      step > index || reduce ? "w-full" : "w-0",
                    )}
                  />
                </span>
              ) : null}
            </motion.li>
          );
        })}
      </ol>
      <figcaption className="mt-4 text-sm text-mist-500">
        Conceptual flow based on the components described. It does not represent any client&rsquo;s internal architecture.
      </figcaption>
    </figure>
  );
}

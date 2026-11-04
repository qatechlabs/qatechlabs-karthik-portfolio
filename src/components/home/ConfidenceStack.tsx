"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { StackLayer } from "@/content/types";
import { ArrowRight } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Homepage centrepiece: the layers of a release-quality system, read from
 * foundation (bottom) to release confidence (top).
 *
 * Interaction: layers assemble bottom-up on load; a signal travels up the
 * spine; selecting a layer (hover, focus, click, or arrow keys) reveals its
 * tools and the case study where it is discussed.
 */
export function ConfidenceStack({ layers }: { layers: StackLayer[] }) {
  const reduce = useReducedMotion();
  const total = layers.length;
  const [active, setActive] = useState(layers[0]?.id);
  const [pulse, setPulse] = useState(total - 1);
  const activeLayer = layers.find((layer) => layer.id === active) ?? layers[0];

  // A signal climbs from the foundation to the top layer, then repeats.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setPulse((p) => (p <= 0 ? total - 1 : p - 1)), 650);
    return () => window.clearInterval(id);
  }, [reduce, total]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = layers[(index + delta + total) % total];
    setActive(next.id);
    document.getElementById(`stack-${next.id}`)?.focus();
  };

  return (
    <figure
      aria-labelledby="stack-caption"
      className="relative rounded-[1.75rem] border border-paper-100/10 bg-gradient-to-b from-navy-850/90 to-navy-900/70 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-8"
    >
      <div aria-hidden="true" className="hairline absolute inset-x-10 top-0 opacity-60" />
      <div className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.2em] text-mist-400 uppercase">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-1.5 rounded-full bg-rose-400" />
          </span>
          Release confidence
        </span>
        <span>Select a layer</span>
      </div>

      <ol className="relative mt-6 space-y-2" data-testid="confidence-stack">
        <span
          aria-hidden="true"
          className="absolute top-5 bottom-5 left-[0.4375rem] w-px bg-gradient-to-b from-rose-400 via-rose-500/40 to-mist-500/30"
        />
        {layers.map((layer, index) => {
          const isActive = layer.id === active;
          const isPulsing = index === pulse;
          return (
            <motion.li
              key={layer.id}
              className="relative flex items-center gap-4"
              initial={reduce ? false : { opacity: 0, y: 22, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.35 + (total - 1 - index) * 0.11 }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex size-[0.9375rem] shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                  isActive || isPulsing ? "border-rose-400 bg-burgundy-800" : "border-mist-500/60 bg-navy-900",
                )}
              >
                <span
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isActive || isPulsing ? "size-1.5 bg-rose-300 shadow-[0_0_10px_2px_rgba(219,173,150,0.7)]" : "size-1 bg-mist-400",
                  )}
                />
              </span>
              <button
                id={`stack-${layer.id}`}
                type="button"
                aria-pressed={isActive}
                aria-controls="stack-detail"
                onClick={() => setActive(layer.id)}
                onMouseEnter={() => setActive(layer.id)}
                onFocus={() => setActive(layer.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  "group min-w-0 flex-1 rounded-xl border px-4 py-3 text-left transition-[border-color,background-color,transform] duration-300",
                  isActive
                    ? "translate-x-1 border-rose-500/45 bg-burgundy-900/35"
                    : "border-paper-100/[0.07] bg-navy-950/40 hover:border-rose-500/30",
                )}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className={cn("font-medium transition-colors", isActive ? "text-rose-200" : "text-paper-50")}>
                    {layer.name}
                  </span>
                  <span className="font-mono text-[0.65rem] text-mist-500" aria-hidden="true">
                    L{String(total - index).padStart(2, "0")}
                  </span>
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-mist-400">{layer.detail}</span>
              </button>
            </motion.li>
          );
        })}
      </ol>

      <div
        id="stack-detail"
        role="region"
        aria-live="polite"
        aria-label="Selected layer"
        className="mt-5 min-h-[6.5rem] overflow-hidden rounded-xl border border-paper-100/[0.07] bg-ink/50 p-4"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeLayer.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease }}
          >
            <p className="font-mono text-[0.65rem] tracking-[0.18em] text-rose-400 uppercase">{activeLayer.name}</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label={`${activeLayer.name} tools`}>
              {activeLayer.tools.map((tool) => (
                <li key={tool} className="rounded-full border border-paper-100/10 px-2.5 py-1 font-mono text-[0.7rem] text-paper-100">
                  {tool}
                </li>
              ))}
            </ul>
            {activeLayer.caseStudy ? (
              <Link
                href={`/case-studies/${activeLayer.caseStudy}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-300 hover:text-rose-200"
              >
                See it in a case study <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <Link href="/lab" className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-300 hover:text-rose-200">
                See current explorations <ArrowRight className="size-3.5" />
              </Link>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <figcaption
        id="stack-caption"
        className="mt-5 font-mono text-[0.68rem] tracking-[0.16em] text-mist-500 uppercase"
      >
        The confidence stack · layers I design and validate
      </figcaption>
    </figure>
  );
}

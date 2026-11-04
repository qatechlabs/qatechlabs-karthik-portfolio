"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { guide } from "@/content/guide";
import { cn } from "@/lib/cn";
import { closeGuide, openGuide, setNarrating, speak, stopSpeaking, useGuide } from "./guide-store";

/**
 * The spoken guide: an animated presenter who introduces Karthik and can
 * narrate the walkthrough. Speech is always started by the visitor.
 */
export function Guide() {
  const state = useGuide();
  const reduce = useReducedMotion();

  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end px-4 pb-4 sm:px-6 sm:pb-6" data-testid="guide">
      <AnimatePresence initial={false} mode="wait">
        {state.open ? (
          <motion.section
            key="panel"
            aria-label="Spoken guide"
            data-testid="guide-panel"
            className="pointer-events-auto flex w-full max-w-md items-end gap-3 rounded-[1.5rem] border border-rose-500/30 bg-navy-900/95 p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md sm:gap-4 sm:p-4"
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Character mouth={state.mouth} speaking={state.speaking} className="size-24 shrink-0 sm:size-28" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[0.65rem] tracking-[0.18em] text-rose-400 uppercase">{guide.name}</p>
                <button
                  type="button"
                  onClick={closeGuide}
                  aria-label={guide.prompts.close}
                  className="inline-flex size-8 items-center justify-center rounded-full text-mist-400 hover:bg-paper-50/[0.06] hover:text-paper-50"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <p aria-live="polite" data-testid="guide-caption" className="mt-1 min-h-[3.4rem] text-[0.9rem] leading-snug text-paper-100">
                {state.caption || (state.supported ? guide.prompts.idle : guide.prompts.unsupported)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {state.speaking ? (
                  <GuideButton onClick={stopSpeaking} primary data-testid="guide-stop">
                    {guide.prompts.stop}
                  </GuideButton>
                ) : (
                  <GuideButton onClick={() => void speak(guide.intro)} primary data-testid="guide-introduce">
                    {guide.prompts.introduce}
                  </GuideButton>
                )}
                <GuideButton onClick={() => setNarrating(!state.narrating)} pressed={state.narrating} data-testid="guide-narrate">
                  {state.narrating ? guide.prompts.narrateOff : guide.prompts.narrateOn}
                </GuideButton>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.button
            key="launcher"
            type="button"
            onClick={openGuide}
            data-testid="guide-open"
            className="pointer-events-auto group flex items-center gap-3 rounded-full border border-rose-500/30 bg-navy-900/95 py-1.5 pr-5 pl-1.5 text-sm text-paper-50 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md hover:border-rose-400/60"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 12 }}
            transition={{ duration: 0.35 }}
          >
            <Character mouth={0} speaking={false} className="size-11" />
            {guide.prompts.open}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function GuideButton({ children, onClick, primary, pressed, ...rest }: { children: React.ReactNode; onClick: () => void; primary?: boolean; pressed?: boolean; "data-testid"?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={cn(
        "inline-flex min-h-9 items-center rounded-full px-3.5 text-[0.8rem] font-medium transition-colors",
        primary ? "bg-rose-400 text-navy-950 hover:bg-rose-300" : pressed ? "border border-rose-400 text-rose-200" : "border border-paper-100/15 text-paper-100 hover:border-rose-400/60",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/**
 * The presenter. Minimal line-art so it sits with the rest of the design:
 * blinking eyes, a mouth that follows the speech, and an arm that lifts a
 * pointer while explaining.
 */
export function Character({ mouth, speaking, className }: { mouth: number; speaking: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const raw = useMotionValue(0);
  const open = useSpring(raw, { stiffness: 500, damping: 30 });
  const mouthRy = useTransform(open, [0, 1], [1.2, 6]);
  const mouthRx = useTransform(open, [0, 1], [6, 5]);
  const armRotate = useSpring(speaking ? -38 : 0, { stiffness: 120, damping: 16 });
  const browLift = useTransform(open, [0, 1], [0, -1.5]);

  useEffect(() => {
    raw.set(reduce ? (speaking ? 0.5 : 0) : mouth);
  }, [mouth, raw, reduce, speaking]);

  useEffect(() => {
    armRotate.set(speaking ? -38 : 0);
  }, [armRotate, speaking]);

  return (
    <svg viewBox="0 0 120 120" className={cn("overflow-visible", className)} aria-hidden="true" data-testid="guide-character" data-speaking={speaking || undefined}>
      <defs>
        <linearGradient id="guide-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-navy-800)" />
          <stop offset="1" stopColor="var(--color-navy-850)" />
        </linearGradient>
      </defs>

      {/* Halo */}
      <circle cx="60" cy="62" r="54" fill="color-mix(in oklab, var(--color-burgundy-800) 35%, transparent)" />
      <circle cx="60" cy="62" r="54" fill="none" stroke="var(--color-rose-500)" strokeOpacity="0.35" />

      {/* Body with lapel */}
      <path d="M22 118 C 24 92, 40 84, 60 84 C 80 84, 96 92, 98 118 Z" fill="url(#guide-skin)" stroke="var(--color-rose-500)" strokeOpacity="0.6" />
      <path d="M60 84 L 52 100 L 60 112 L 68 100 Z" fill="var(--color-navy-950)" stroke="var(--color-rose-400)" strokeWidth="0.75" />

      {/* Pointer arm: lifts while speaking */}
      <motion.g style={{ rotate: armRotate, transformOrigin: "88px 96px" }}>
        <path d="M88 96 L 112 72" stroke="var(--color-rose-300)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="114" cy="70" r="3.5" fill="var(--color-rose-200)" />
        <motion.circle cx="114" cy="70" r="7" fill="none" stroke="var(--color-rose-300)" animate={speaking && !reduce ? { opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.15, 0.9] } : { opacity: 0 }} transition={{ duration: 1.6, repeat: speaking && !reduce ? Infinity : 0, ease: "easeInOut" }} style={{ transformOrigin: "114px 70px" }} />
      </motion.g>

      {/* Head */}
      <motion.g animate={speaking && !reduce ? { rotate: [0, -2.5, 0, 2, 0] } : { rotate: 0 }} transition={{ duration: 3.2, repeat: speaking && !reduce ? Infinity : 0, ease: "easeInOut" }} style={{ transformOrigin: "60px 70px" }}>
        <circle cx="60" cy="50" r="26" fill="url(#guide-skin)" stroke="var(--color-rose-400)" strokeWidth="1.25" />
        {/* Hair line */}
        <path d="M36 44 C 40 26, 80 26, 84 44 C 76 36, 44 36, 36 44 Z" fill="var(--color-navy-950)" />
        {/* Brows */}
        <motion.path d="M46 41 Q 51 38, 56 41" fill="none" stroke="var(--color-paper-100)" strokeWidth="1.5" strokeLinecap="round" style={{ y: browLift }} />
        <motion.path d="M64 41 Q 69 38, 74 41" fill="none" stroke="var(--color-paper-100)" strokeWidth="1.5" strokeLinecap="round" style={{ y: browLift }} />
        {/* Eyes: blink via CSS so it costs nothing */}
        <g className={reduce ? undefined : "guide-blink"} style={{ transformOrigin: "60px 48px" }}>
          <ellipse cx="51" cy="48" rx="2.6" ry="3" fill="var(--color-paper-50)" />
          <ellipse cx="69" cy="48" rx="2.6" ry="3" fill="var(--color-paper-50)" />
        </g>
        {/* Mouth */}
        <motion.ellipse cx="60" cy="61" fill="var(--color-burgundy-900)" stroke="var(--color-rose-300)" strokeWidth="1" style={{ rx: mouthRx, ry: mouthRy }} />
      </motion.g>
    </svg>
  );
}

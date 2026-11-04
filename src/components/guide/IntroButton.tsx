"use client";

import { guide } from "@/content/guide";
import { cn } from "@/lib/cn";
import { speak, useGuide } from "./guide-store";

/** Hero call to action that asks the guide to introduce Karthik. */
export function IntroButton({ className }: { className?: string }) {
  const { speaking } = useGuide();
  return (
    <button
      type="button"
      data-testid="cta-intro"
      onClick={() => void speak(guide.intro, { open: true })}
      className={cn(
        "inline-flex min-h-11 items-center whitespace-nowrap justify-center gap-2.5 rounded-full border border-rose-500/40 bg-burgundy-900/30 px-5 text-[0.95rem] font-medium text-rose-100 transition-colors hover:border-rose-400 hover:bg-burgundy-900/50",
        className,
      )}
    >
      <span aria-hidden="true" className="flex items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("w-[2px] rounded-full bg-rose-300", speaking ? "guide-bar" : "h-1.5")}
            style={speaking ? { animationDelay: `${i * 0.12}s` } : undefined}
          />
        ))}
      </span>
      {speaking ? "Listening to the introduction" : "Hear the introduction"}
    </button>
  );
}

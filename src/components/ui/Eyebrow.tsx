import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small mono label used above headings. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[0.72rem] font-medium tracking-[0.22em] text-rose-400 uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-rose-500/70" />
      {children}
    </p>
  );
}

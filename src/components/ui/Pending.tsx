import { isPending, type Verified } from "@/content";
import { cn } from "@/lib/cn";

/**
 * Visible content placeholder. Rendered wherever a fact has not been
 * verified, so unverified content is never presented as real.
 */
export function PendingNote({ note, className }: { note: string; className?: string }) {
  return (
    <span
      data-placeholder
      className={cn(
        "inline-flex items-baseline gap-2 rounded-sm border border-dashed border-rose-500/50 bg-burgundy-900/30 px-2 py-0.5 font-mono text-[0.72rem] leading-relaxed text-rose-300",
        className,
      )}
    >
      <span className="font-semibold tracking-wider uppercase">Placeholder</span>
      <span className="text-rose-200/90">{note}</span>
    </span>
  );
}

/** Render a verified string, or its placeholder. */
export function VerifiedText({
  value,
  className,
}: {
  value: Verified<string>;
  className?: string;
}) {
  if (isPending(value)) return <PendingNote note={value.note} />;
  return <span className={className}>{value}</span>;
}

import { cn } from "@/lib/cn";

/** Quiet, text-led list of technologies. Deliberately not badge-styled. */
export function TagList({ items, className, label }: { items: string[]; className?: string; label?: string }) {
  if (items.length === 0) return null;
  return (
    <ul
      aria-label={label}
      className={cn("flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.75rem] text-mist-400", className)}
    >
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-4">
          {index > 0 ? <span aria-hidden="true" className="size-1 rounded-full bg-rose-500/50" /> : null}
          {item}
        </li>
      ))}
    </ul>
  );
}

import type { StackLayer } from "@/content";

/**
 * Homepage centrepiece: the layers of a release-quality system, read from
 * foundation (bottom) to release confidence (top).
 */
export function ConfidenceStack({ layers }: { layers: StackLayer[] }) {
  const total = layers.length;
  return (
    <figure
      aria-labelledby="stack-caption"
      className="relative rounded-[1.75rem] border border-paper-100/10 bg-gradient-to-b from-navy-850/90 to-navy-900/70 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-8"
    >
      <div className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.2em] text-mist-400 uppercase">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-rose-400" />
          Release confidence
        </span>
        <span aria-hidden="true">↑</span>
      </div>

      <ol className="relative mt-6 space-y-2.5" data-testid="confidence-stack">
        <span
          aria-hidden="true"
          className="absolute top-5 bottom-5 left-[0.4375rem] w-px bg-gradient-to-b from-rose-400 via-rose-500/40 to-mist-500/30"
        />
        {layers.map((layer, index) => {
          const level = total - index;
          const top = index === 0;
          return (
            <li
              key={layer.id}
              className="animate-rise relative flex items-center gap-4"
              style={{ animationDelay: `${150 + (total - index) * 90}ms` }}
            >
              <span
                aria-hidden="true"
                className={
                  top
                    ? "relative z-10 flex size-[0.9375rem] shrink-0 items-center justify-center rounded-full border border-rose-400 bg-burgundy-800"
                    : "relative z-10 flex size-[0.9375rem] shrink-0 items-center justify-center rounded-full border border-mist-500/60 bg-navy-900"
                }
              >
                <span className={top ? "size-1.5 rounded-full bg-rose-300" : "size-1 rounded-full bg-mist-400"} />
              </span>
              <span
                className={
                  top
                    ? "min-w-0 flex-1 rounded-xl border border-rose-500/35 bg-burgundy-900/25 px-4 py-3.5"
                    : "min-w-0 flex-1 rounded-xl border border-paper-100/[0.07] bg-navy-950/40 px-4 py-3.5 transition-colors hover:border-rose-500/40"
                }
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className={top ? "font-medium text-rose-200" : "font-medium text-paper-50"}>{layer.name}</span>
                  <span className="font-mono text-[0.65rem] text-mist-500" aria-hidden="true">
                    L{String(level).padStart(2, "0")}
                  </span>
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-mist-400">{layer.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <figcaption
        id="stack-caption"
        className="mt-6 border-t border-paper-100/[0.07] pt-4 font-mono text-[0.68rem] tracking-[0.16em] text-mist-500 uppercase"
      >
        The confidence stack · layers I design and validate
      </figcaption>
    </figure>
  );
}

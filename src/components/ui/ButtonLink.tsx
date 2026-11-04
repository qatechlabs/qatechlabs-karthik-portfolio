import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-rose-400 text-navy-950 hover:bg-rose-300 shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_10px_30px_-12px_rgba(219,173,150,0.55)]",
  secondary:
    "border border-paper-100/20 text-paper-50 hover:border-rose-400/70 hover:bg-paper-50/[0.04]",
  ghost: "text-paper-100 underline-offset-[6px] decoration-rose-500/60 hover:underline px-0!",
};

function isExternal(href: string) {
  return /^(https?:|mailto:)/.test(href);
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  download,
  testId,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  download?: boolean;
  testId?: string;
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[0.95rem] font-medium transition-colors duration-200",
    styles[variant],
    className,
  );

  if (isExternal(href) || download) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        data-testid={testId}
        download={download || undefined}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {external ? (
          <>
            <ArrowUpRight />
            <span className="sr-only">(opens in a new tab)</span>
          </>
        ) : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} data-testid={testId}>
      {children}
    </Link>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-3.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

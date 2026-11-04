"use client";

export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-rose-400 px-6 text-[0.95rem] font-medium text-navy-950 transition-colors hover:bg-rose-300"
    >
      {label}
    </button>
  );
}

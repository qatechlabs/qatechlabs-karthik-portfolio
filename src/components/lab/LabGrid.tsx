"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { isPending, type LabEntry, type LabStatus } from "@/content/types";
import { Spotlight } from "@/components/motion/Spotlight";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { VerifiedText } from "@/components/ui/Pending";
import { TagList } from "@/components/ui/TagList";
import { cn } from "@/lib/cn";

const statusStyle: Record<LabStatus, string> = {
  published: "border-emerald-300/40 text-emerald-200",
  "in-progress": "border-rose-400/50 text-rose-200",
  exploration: "border-mist-400/40 text-mist-300",
  planned: "border-paper-100/20 text-mist-400",
};

type Filter = "all" | LabStatus;

export function LabGrid({ entries, labels }: { entries: LabEntry[]; labels: Record<LabStatus, string> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const statuses = (Object.keys(labels) as LabStatus[]).filter((status) => entries.some((e) => e.status === status));
  const visible = filter === "all" ? entries : entries.filter((entry) => entry.status === filter);
  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: entries.length },
    ...statuses.map((status) => ({ value: status, label: labels[status], count: entries.filter((e) => e.status === status).length })),
  ];

  return (
    <LayoutGroup>
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option.value)}
              className={cn(
                "relative inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
                active ? "border-rose-400/60 text-navy-950" : "border-paper-100/15 text-mist-300 hover:text-paper-50",
              )}
            >
              {active ? (
                <motion.span layoutId="lab-filter" className="absolute inset-0 -z-10 rounded-full bg-rose-400" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              ) : null}
              {option.label}
              <span className={cn("font-mono text-[0.7rem]", active ? "text-navy-900/70" : "text-mist-500")}>{option.count}</span>
            </button>
          );
        })}
      </div>

      <Spotlight as="ul" className="mt-10 grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((entry) => (
            <motion.li
              layout
              key={entry.slug}
              data-testid="lab-entry"
              data-spotlight
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-[1.25rem] border border-paper-100/[0.08] bg-navy-900/70 p-7 transition-colors hover:border-rose-500/30 sm:p-8"
            >
              <span className={cn("self-start rounded-full border px-3 py-1 font-mono text-[0.65rem] tracking-[0.16em] uppercase", statusStyle[entry.status])}>
                {labels[entry.status]}
              </span>
              <h2 className="mt-6 font-display text-[1.75rem] leading-tight text-paper-50">{entry.title}</h2>
              <p className="mt-3 leading-relaxed text-mist-300">{entry.summary}</p>
              <ul className="mt-5 space-y-2 text-sm text-mist-400">
                {entry.focus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6rem] h-px w-3 shrink-0 bg-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                <TagList items={entry.stack} label={`${entry.title} stack`} />
                {isPending(entry.repository) ? (
                  <VerifiedText value={entry.repository} />
                ) : (
                  <ButtonLink href={entry.repository.href} variant="secondary">
                    {entry.repository.label}
                  </ButtonLink>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </Spotlight>
    </LayoutGroup>
  );
}

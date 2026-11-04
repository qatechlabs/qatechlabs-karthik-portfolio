"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * "On this page" navigation that highlights the section being read.
 * The current section is the last one whose heading has passed a reading line
 * 30% down the viewport, which is deterministic and matches where the eye is.
 */
export function TocNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(sections[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const line = window.innerHeight * 0.3;
      let active = sections[0]?.id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= line) active = section.id;
      }
      setCurrent(active);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="font-mono text-[0.68rem] tracking-[0.18em] text-mist-500 uppercase">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-paper-100/[0.08] text-sm">
        {sections.map((section, index) => {
          const active = section.id === current;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px flex items-center gap-3 border-l py-1.5 pl-4 transition-all duration-300",
                  active ? "border-rose-400 text-paper-50" : "border-transparent text-mist-400 hover:text-paper-100",
                )}
              >
                <span className={cn("font-mono text-[0.65rem] transition-colors", active ? "text-rose-400" : "text-mist-500")}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

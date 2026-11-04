"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Tracks the pointer inside its area and exposes the position as CSS custom
 * properties (--spot-x, --spot-y) on the nearest [data-spotlight] element, or
 * on the container itself. Styles in globals.css draw the light.
 */
export function Spotlight({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = (event.target as HTMLElement).closest<HTMLElement>("[data-spotlight]") ?? root;
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        target.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
        if (target !== root) {
          const rootRect = root.getBoundingClientRect();
          root.style.setProperty("--spot-x", `${event.clientX - rootRect.left}px`);
          root.style.setProperty("--spot-y", `${event.clientY - rootRect.top}px`);
        }
      });
    };
    root.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic ref
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}

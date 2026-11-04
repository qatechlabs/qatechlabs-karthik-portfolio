"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts a figure such as "9+" or "40%" up from zero when it scrolls into view.
 * The final value is server-rendered, so it is correct without JavaScript.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || reduce) return;
    const [, prefix, number, suffix] = match;
    if (!inView) {
      el.textContent = `${prefix}0${suffix}`;
      return;
    }
    const target = Number(number);
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        el.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- match is derived from value
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

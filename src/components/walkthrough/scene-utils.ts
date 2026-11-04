"use client";

import { useTransform, type MotionValue } from "motion/react";

export type SceneProps = {
  /** 0 → 1 as the visitor moves through this scene. */
  progress: MotionValue<number>;
};

/** Maps a slice [from, to] of the scene's progress onto 0 → 1, clamped. */
export function useStep(progress: MotionValue<number>, from: number, to: number) {
  return useTransform(progress, [from, to], [0, 1], { clamp: true });
}

/** Linear interpolation of a step onto an output range. */
export function useLerp(step: MotionValue<number>, a: number, b: number) {
  return useTransform(step, [0, 1], [a, b]);
}

export const ink = {
  line: "var(--color-mist-500)",
  lineSoft: "color-mix(in oklab, var(--color-mist-500) 45%, transparent)",
  text: "var(--color-paper-100)",
  textSoft: "var(--color-mist-300)",
  mono: "var(--color-mist-400)",
  rose: "var(--color-rose-400)",
  roseSoft: "color-mix(in oklab, var(--color-rose-400) 35%, transparent)",
  burgundy: "var(--color-burgundy-700)",
  burgundySoft: "color-mix(in oklab, var(--color-burgundy-700) 55%, transparent)",
  panel: "var(--color-navy-850)",
  panelDeep: "var(--color-navy-950)",
  paper: "var(--color-paper-50)",
};

export const mono = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.12em",
} as const;

export const sans = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
} as const;

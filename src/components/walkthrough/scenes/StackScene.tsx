"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { confidenceStack } from "@/content/home";
import { ink, mono, sans, useLerp, useStep, type SceneProps } from "../scene-utils";

/** Layers in execution order: L01 at the bottom first, L06 at the top last. */
const layers = [...confidenceStack].reverse();
const count = layers.length;
const X = 150;
const W = 380;
const H = 46;
const GAP = 12;
const BOTTOM = 440;

function yFor(i: number) {
  return BOTTOM - (i + 1) * (H + GAP);
}

/**
 * Scene 0: the confidence stack assembles in execution order. Each layer
 * slides into place from the foundation up, the signal climbs the spine, and
 * release confidence lights at the top.
 */
export function StackScene({ progress }: SceneProps) {
  const build = useStep(progress, 0.02, 0.85);
  const done = useStep(progress, 0.85, 1);
  const signalY = useTransform(build, [0, 1], [BOTTOM, yFor(count - 1) + H / 2]);
  const spineLength = build;

  return (
    <svg viewBox="0 0 610 500" className="h-full w-full" role="img" aria-label="The confidence stack assembling from layer one to layer six">
      <text x={X} y={470} fill={ink.mono} style={mono}>
        EXECUTION ORDER · L01 → L06
      </text>

      {/* Spine */}
      <line x1={X - 24} y1={BOTTOM} x2={X - 24} y2={yFor(count - 1) + H / 2} stroke={ink.lineSoft} />
      <motion.line x1={X - 24} y1={BOTTOM} x2={X - 24} y2={yFor(count - 1) + H / 2} stroke={ink.rose} strokeWidth={1.5} style={{ pathLength: spineLength }} />

      {layers.map((layer, i) => (
        <Layer key={layer.id} i={i} name={layer.name} detail={layer.detail} build={build} />
      ))}

      {/* Climbing signal */}
      <motion.g style={{ y: signalY }}>
        <circle cx={X - 24} cy={0} r={5} fill={ink.paper} />
        <circle cx={X - 24} cy={0} r={10} fill="none" stroke={ink.rose} />
      </motion.g>

      {/* Release confidence */}
      <motion.g style={{ opacity: done }}>
        <rect x={X} y={yFor(count - 1) - 54} width={W} height={34} rx={17} fill={ink.panelDeep} stroke={ink.rose} strokeWidth={1.5} />
        <text x={X + W / 2} y={yFor(count - 1) - 32} textAnchor="middle" fill={ink.rose} style={{ ...mono, letterSpacing: "0.22em" }}>
          RELEASE CONFIDENCE
        </text>
      </motion.g>
    </svg>
  );
}

function Layer({ i, name, detail, build }: { i: number; name: string; detail: string; build: MotionValue<number> }) {
  const start = i / count;
  const end = (i + 0.8) / count;
  const t = useTransform(build, [start, end], [0, 1], { clamp: true });
  const x = useLerp(t, 36, 0);
  const lit = useTransform(build, [end, Math.min(1, end + 0.05)], [0, 1], { clamp: true });
  const strokeOpacity = useLerp(lit, 0.35, 1);
  const y = yFor(i);
  return (
    <motion.g style={{ opacity: t, x }}>
      <rect x={X} y={y} width={W} height={H} rx={10} fill={ink.panel} stroke={ink.lineSoft} />
      <motion.rect x={X} y={y} width={W} height={H} rx={10} fill="none" stroke={ink.rose} strokeWidth={1.25} style={{ opacity: strokeOpacity }} />
      <text x={X + 16} y={y + 19} fill={ink.text} style={sans} fontWeight={500}>
        {name}
      </text>
      <text x={X + 16} y={y + 35} fill={ink.textSoft} style={{ ...sans, fontSize: 11 }}>
        {detail}
      </text>
      <text x={X + W - 14} y={y + 28} textAnchor="end" fill={ink.mono} style={mono}>
        L{String(i + 1).padStart(2, "0")}
      </text>
      <motion.circle cx={X - 24} cy={y + H / 2} r={4} fill={ink.rose} style={{ opacity: lit }} />
      <line x1={X - 20} y1={y + H / 2} x2={X} y2={y + H / 2} stroke={ink.lineSoft} />
    </motion.g>
  );
}

"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { ink, mono, sans, useLerp, useStep, type SceneProps } from "../scene-utils";

const flows = [
  { label: "Hire", x: 120, y: 110 },
  { label: "Pay", x: 470, y: 100 },
  { label: "Close books", x: 520, y: 300 },
  { label: "Integrate", x: 300, y: 420 },
  { label: "Report", x: 90, y: 330 },
];
const deps = [
  { label: "HCM", x: 200, y: 200, risky: false },
  { label: "Payroll", x: 400, y: 190, risky: true },
  { label: "Finance", x: 420, y: 340, risky: true },
  { label: "Integrations", x: 200, y: 330, risky: false },
];
const center = { x: 305, y: 262 };
const risky = deps.filter((d) => d.risky);

/**
 * Scene 1: the release map. Business flows appear, their dependencies connect,
 * risk concentrates on two of them, and coverage is drawn around the risk.
 */
export function RiskScene({ progress }: SceneProps) {
  const appear = useStep(progress, 0.05, 0.3);
  const connect = useStep(progress, 0.3, 0.55);
  const risk = useStep(progress, 0.55, 0.78);
  const cover = useStep(progress, 0.78, 1);
  const centerScale = useLerp(appear, 0.6, 1);
  const coverLabel = useLerp(cover, 0, 1);

  return (
    <svg viewBox="0 0 610 500" className="h-full w-full" role="img" aria-label="Release map: flows, dependencies, risk, and coverage">
      <defs>
        <radialGradient id="risk-halo">
          <stop offset="0%" stopColor={ink.burgundy} stopOpacity="0.75" />
          <stop offset="100%" stopColor={ink.burgundy} stopOpacity="0" />
        </radialGradient>
      </defs>

      {flows.map((flow, i) => (
        <Edge key={flow.label} from={flow} to={deps[i % deps.length]} step={connect} delay={i * 0.12} />
      ))}
      {deps.map((dep, i) => (
        <Edge key={dep.label} from={dep} to={center} step={connect} delay={0.3 + i * 0.1} />
      ))}

      {risky.map((dep) => (
        <Halo key={dep.label} x={dep.x} y={dep.y} step={risk} />
      ))}
      {risky.map((dep, i) => (
        <CoverRing key={dep.label} x={dep.x} y={dep.y} step={cover} i={i} />
      ))}

      <motion.g style={{ scale: centerScale, opacity: appear, transformOrigin: `${center.x}px ${center.y}px` }}>
        <circle cx={center.x} cy={center.y} r={34} fill={ink.panelDeep} stroke={ink.rose} strokeWidth={1.5} />
        <text x={center.x} y={center.y + 4} textAnchor="middle" fill={ink.paper} style={sans} fontWeight={500}>
          Release
        </text>
      </motion.g>

      {deps.map((dep, i) => (
        <Node key={dep.label} x={dep.x} y={dep.y} label={dep.label} source={progress} from={0.28 + i * 0.04} to={0.42 + i * 0.04} kind="system" />
      ))}
      {flows.map((flow, i) => (
        <Node key={flow.label} x={flow.x} y={flow.y} label={flow.label} source={appear} from={i * 0.14} to={0.45 + i * 0.14} kind="flow" />
      ))}

      <motion.text x={305} y={486} textAnchor="middle" fill={ink.rose} style={{ ...mono, opacity: coverLabel }}>
        COVERAGE DESIGNED AROUND RISK
      </motion.text>
    </svg>
  );
}

function Halo({ x, y, step }: { x: number; y: number; step: MotionValue<number> }) {
  const scale = useLerp(step, 0.2, 1);
  const opacity = useLerp(step, 0, 0.9);
  return <motion.circle cx={x} cy={y} r={62} fill="url(#risk-halo)" style={{ scale, opacity, transformOrigin: `${x}px ${y}px` }} />;
}

function CoverRing({ x, y, step, i }: { x: number; y: number; step: MotionValue<number>; i: number }) {
  const pathLength = useStep(step, i * 0.3, 0.7 + i * 0.3);
  return <motion.circle cx={x} cy={y} r={40} fill="none" stroke={ink.rose} strokeWidth={1.75} style={{ pathLength, rotate: -90, transformOrigin: `${x}px ${y}px` }} />;
}

function Node({ x, y, label, source, from, to, kind }: { x: number; y: number; label: string; source: MotionValue<number>; from: number; to: number; kind: "flow" | "system" }) {
  const step = useStep(source, from, to);
  const scale = useLerp(step, 0.7, 1);
  const w = kind === "flow" ? 92 : 104;
  return (
    <motion.g style={{ opacity: step, scale, transformOrigin: `${x}px ${y}px` }}>
      <rect x={x - w / 2} y={y - 16} width={w} height={32} rx={kind === "flow" ? 16 : 6} fill={kind === "flow" ? ink.panel : ink.panelDeep} stroke={kind === "flow" ? ink.lineSoft : ink.line} />
      <text x={x} y={y + 4} textAnchor="middle" fill={kind === "flow" ? ink.textSoft : ink.text} style={kind === "flow" ? sans : { ...mono, letterSpacing: "0.08em" }}>
        {kind === "flow" ? label : label.toUpperCase()}
      </text>
    </motion.g>
  );
}

function Edge({ from, to, step, delay }: { from: { x: number; y: number }; to: { x: number; y: number }; step: MotionValue<number>; delay: number }) {
  const pathLength = useTransform(step, [Math.min(delay, 0.6), Math.min(delay + 0.4, 1)], [0, 1], { clamp: true });
  return <motion.line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={ink.lineSoft} strokeWidth={1} style={{ pathLength }} />;
}

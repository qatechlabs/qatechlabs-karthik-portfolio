"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { ink, mono, sans, useLerp, useStep, type SceneProps } from "../scene-utils";

const stages = [
  { label: "Change", sub: "commit", x: 70 },
  { label: "Lint · Types", sub: "checks", x: 190 },
  { label: "Tests", sub: "workers", x: 310 },
  { label: "Quality gate", sub: "SonarQube · API", x: 430 },
  { label: "Release", sub: "signal", x: 550 },
];
const Y = 250;

/**
 * Scene 4: the release pipeline. A build token travels left to right; each
 * stage lights as it passes; the test stage fans into parallel workers; the
 * gate opens for the release.
 */
export function GatesScene({ progress }: SceneProps) {
  const travel = useStep(progress, 0.05, 0.9);
  const tokenX = useLerp(travel, stages[0].x, stages[4].x);
  const tokenOpacity = useTransform(travel, [0, 0.02, 0.97, 1], [0, 1, 1, 0]);
  const release = useStep(progress, 0.88, 1);

  return (
    <svg viewBox="0 0 610 500" className="h-full w-full" role="img" aria-label="Release pipeline: change, static checks, parallel tests, quality gate, release">
      <line x1={stages[0].x} y1={Y} x2={stages[4].x} y2={Y} stroke={ink.lineSoft} />
      <motion.line x1={stages[0].x} y1={Y} x2={stages[4].x} y2={Y} stroke={ink.rose} strokeWidth={1.5} style={{ pathLength: travel }} />

      {[0, 1, 2].map((i) => (
        <Worker key={i} i={i} travel={travel} />
      ))}
      {stages.map((stage, i) => (
        <StageNode key={stage.label} stage={stage} i={i} travel={travel} release={release} />
      ))}

      <motion.g style={{ x: tokenX, opacity: tokenOpacity }}>
        <circle cx={0} cy={Y} r={6} fill={ink.paper} />
        <circle cx={0} cy={Y} r={12} fill="none" stroke={ink.rose} />
      </motion.g>

      <motion.text x={305} y={470} textAnchor="middle" fill={ink.rose} style={{ ...mono, opacity: release }}>
        A SIGNAL THE TEAM CAN TRUST
      </motion.text>
    </svg>
  );
}

function Worker({ i, travel }: { i: number; travel: MotionValue<number> }) {
  const wy = 358 + i * 26;
  const appear = useStep(travel, 0.38, 0.45);
  const fill = useTransform(travel, [0.42 + i * 0.03, 0.62 + i * 0.03], [0, 1], { clamp: true });
  return (
    <g>
      <motion.path d={`M 310 ${Y + 22} C 310 ${wy}, 250 ${wy}, 250 ${wy}`} fill="none" stroke={ink.lineSoft} style={{ opacity: appear }} />
      <motion.rect x={250} y={wy - 6} width={120} height={12} rx={6} fill={ink.panel} style={{ opacity: appear }} />
      <motion.rect x={250} y={wy - 6} width={120} height={12} rx={6} fill={ink.rose} style={{ scaleX: fill, transformOrigin: "250px 0px" }} />
      <motion.text x={378} y={wy + 4} fill={ink.mono} style={{ ...mono, opacity: appear }}>
        W{i + 1}
      </motion.text>
    </g>
  );
}

function StageNode({ stage, i, travel, release }: { stage: (typeof stages)[number]; i: number; travel: MotionValue<number>; release: MotionValue<number> }) {
  const at = i / (stages.length - 1);
  const lit = useTransform(travel, [Math.max(0, at - 0.08), at], [0, 1], { clamp: true });
  const gateOpen = useTransform(travel, [0.62, 0.74], [1, 0.55], { clamp: true });
  const ringScale = useLerp(release, 0.6, 1);
  const labelOpacity = useLerp(lit, 0.55, 1);
  const subOpacity = useLerp(lit, 0.4, 1);
  const isGate = i === 3;
  const isRelease = i === 4;
  return (
    <g>
      {isGate ? (
        <>
          <motion.rect x={stage.x - 3} y={Y - 60} width={6} height={44} rx={2} fill={ink.rose} style={{ scaleY: gateOpen, transformOrigin: `${stage.x}px ${Y - 60}px` }} />
          <motion.rect x={stage.x - 3} y={Y + 16} width={6} height={44} rx={2} fill={ink.rose} style={{ scaleY: gateOpen, transformOrigin: `${stage.x}px ${Y + 60}px` }} />
        </>
      ) : null}
      <circle cx={stage.x} cy={Y} r={isRelease ? 20 : 14} fill={ink.panelDeep} stroke={ink.line} />
      <motion.circle cx={stage.x} cy={Y} r={isRelease ? 20 : 14} fill={isRelease ? ink.rose : ink.panelDeep} stroke={ink.rose} strokeWidth={1.5} style={{ opacity: isRelease ? release : lit }} />
      {isRelease ? (
        <motion.circle cx={stage.x} cy={Y} r={32} fill="none" stroke={ink.roseSoft} style={{ opacity: release, scale: ringScale, transformOrigin: `${stage.x}px ${Y}px` }} />
      ) : (
        <motion.path d={`M ${stage.x - 5} ${Y} l 3.5 3.5 l 7 -7`} fill="none" stroke={ink.rose} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: lit }} />
      )}
      <motion.text x={stage.x} y={Y - (isGate ? 76 : 40)} textAnchor="middle" fill={ink.text} style={{ ...sans, fontWeight: 500, opacity: labelOpacity }}>
        {stage.label}
      </motion.text>
      <motion.text x={stage.x} y={Y + (isGate ? 84 : 52)} textAnchor="middle" fill={ink.mono} style={{ ...mono, opacity: subOpacity }}>
        {stage.sub.toUpperCase()}
      </motion.text>
    </g>
  );
}

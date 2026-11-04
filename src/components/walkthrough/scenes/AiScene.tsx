"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { ink, mono, sans, useLerp, useStep, type SceneProps } from "../scene-utils";

const proposals = ["negative amount", "expired token", "duplicate submit"];
const codeLines = ["await expect(settlement)", '  .toMatchObject({ status: "SETTLED",', "                   amount: expected });"];

/**
 * Scene 5: AI proposes, the engineer reviews, the assertion stays
 * deterministic, and the release stays accountable to a person.
 */
export function AiScene({ progress }: SceneProps) {
  const propose = useStep(progress, 0.04, 0.32);
  const review = useStep(progress, 0.32, 0.6);
  const assert = useStep(progress, 0.6, 0.82);
  const own = useStep(progress, 0.82, 1);

  const reviewerOpacity = useLerp(review, 0.5, 1);
  const assertLine = useStep(assert, 0, 0.3);
  const assertBox = useStep(assert, 0.25, 0.6);
  const assertY = useLerp(assert, 8, 0);
  const verdictLabel = useStep(assert, 0.9, 1);
  const ownLine = useStep(own, 0, 0.35);
  const ownBox = useStep(own, 0.3, 0.8);
  const ownScale = useLerp(ownBox, 0.9, 1);

  return (
    <svg viewBox="0 0 610 500" className="h-full w-full" role="img" aria-label="AI proposes, engineer reviews, deterministic assertion, accountable release">
      <g>
        <rect x={40} y={70} width={150} height={60} rx={10} fill={ink.panel} stroke={ink.lineSoft} />
        <text x={60} y={94} fill={ink.mono} style={mono}>
          AI
        </text>
        <text x={60} y={114} fill={ink.text} style={sans} fontWeight={500}>
          proposes scenarios
        </text>
      </g>

      {proposals.map((label, i) => (
        <Proposal key={label} label={label} i={i} propose={propose} review={review} />
      ))}

      <motion.g style={{ opacity: reviewerOpacity }}>
        <rect x={420} y={70} width={150} height={60} rx={10} fill={ink.panel} stroke={ink.rose} />
        <text x={440} y={94} fill={ink.rose} style={mono}>
          ENGINEER
        </text>
        <text x={440} y={114} fill={ink.text} style={sans} fontWeight={500}>
          reviews every one
        </text>
      </motion.g>

      <motion.line x1={495} y1={130} x2={495} y2={214} stroke={ink.rose} style={{ pathLength: assertLine }} />
      <motion.g style={{ opacity: assertBox, y: assertY }}>
        <rect x={120} y={214} width={420} height={120} rx={10} fill={ink.panelDeep} stroke={ink.line} />
        <text x={140} y={238} fill={ink.mono} style={mono}>
          DETERMINISTIC ASSERTION
        </text>
        {codeLines.map((line, i) => (
          <CodeLine key={line} line={line} i={i} assert={assert} />
        ))}
      </motion.g>
      <motion.text x={540} y={238} textAnchor="end" fill={ink.rose} style={{ ...mono, opacity: verdictLabel }}>
        NO MODEL IN THE VERDICT
      </motion.text>

      <motion.line x1={330} y1={334} x2={330} y2={382} stroke={ink.rose} style={{ pathLength: ownLine }} />
      <motion.g style={{ opacity: ownBox, scale: ownScale, transformOrigin: "330px 420px" }}>
        <circle cx={330} cy={420} r={36} fill={ink.panelDeep} stroke={ink.rose} strokeWidth={1.5} />
        <circle cx={330} cy={420} r={48} fill="none" stroke={ink.roseSoft} />
        <text x={330} y={416} textAnchor="middle" fill={ink.paper} style={sans} fontWeight={500}>
          Release
        </text>
        <text x={330} y={432} textAnchor="middle" fill={ink.textSoft} style={{ ...sans, fontSize: 10.5 }}>
          owned by a person
        </text>
      </motion.g>
    </svg>
  );
}

function Proposal({ label, i, propose, review }: { label: string; i: number; propose: MotionValue<number>; review: MotionValue<number> }) {
  const y = 90 + i * 40;
  const accepted = i !== 1;
  const t = useTransform(propose, [i * 0.18, 0.5 + i * 0.18], [0, 1], { clamp: true });
  const x = useLerp(t, 150, 230);
  const verdict = useTransform(review, [0.2 + i * 0.2, 0.5 + i * 0.2], [0, 1], { clamp: true });
  const verdictScale = useLerp(verdict, 0.5, 1);
  return (
    <motion.g style={{ x, opacity: t }}>
      <rect x={0} y={y} width={150} height={28} rx={14} fill={ink.panelDeep} stroke={ink.lineSoft} />
      <text x={14} y={y + 18} fill={ink.textSoft} style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
        {label}
      </text>
      <motion.g style={{ opacity: verdict, scale: verdictScale, transformOrigin: `136px ${y + 14}px` }}>
        <circle cx={136} cy={y + 14} r={8} fill={accepted ? ink.rose : ink.burgundy} />
        {accepted ? (
          <path d={`M 132 ${y + 14} l 2.5 2.5 l 5 -5`} fill="none" stroke={ink.panelDeep} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d={`M 133 ${y + 11} l 6 6 M 139 ${y + 11} l -6 6`} fill="none" stroke={ink.paper} strokeWidth={1.5} strokeLinecap="round" />
        )}
      </motion.g>
    </motion.g>
  );
}

function CodeLine({ line, i, assert }: { line: string; i: number; assert: MotionValue<number> }) {
  const opacity = useTransform(assert, [0.45 + i * 0.15, 0.6 + i * 0.15], [0, 1], { clamp: true });
  return (
    <motion.text x={140} y={266 + i * 20} fill={i === 0 ? ink.paper : ink.text} style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, opacity }}>
      {line}
    </motion.text>
  );
}

"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { ink, mono, sans, useLerp, useStep, type SceneProps } from "../scene-utils";

/**
 * Scene 3: beneath the UI. A message is published to a topic, consumed by a
 * downstream service, the resulting state is verified, and the whole path is
 * traced in observability tooling. Names are illustrative.
 */
export function BeneathScene({ progress }: SceneProps) {
  const layers = useStep(progress, 0.02, 0.2);
  const publish = useStep(progress, 0.2, 0.45);
  const consume = useStep(progress, 0.45, 0.65);
  const verify = useStep(progress, 0.65, 0.8);
  const trace = useStep(progress, 0.8, 1);

  const uiOpacity = useLerp(layers, 0, 0.35);
  const msgX = useTransform([publish, consume], ([p, c]: number[]) => 120 + p * 185 + c * 185);
  const msgOpacity = useTransform([publish, consume], ([p, c]: number[]) => (p > 0.02 && c < 0.98 ? 1 : 0));
  const publishedLabel = useStep(publish, 0.5, 1);
  const consumedLabel = useStep(consume, 0.5, 1);
  const verifyY = useLerp(verify, 10, 0);

  return (
    <svg viewBox="0 0 610 500" className="h-full w-full" role="img" aria-label="Event flow: publish, consume, verify, trace">
      <motion.g style={{ opacity: uiOpacity }}>
        <rect x={60} y={40} width={490} height={70} rx={10} fill={ink.panel} stroke={ink.lineSoft} />
        <text x={80} y={66} fill={ink.mono} style={mono}>
          UI
        </text>
        <rect x={80} y={78} width={160} height={10} rx={5} fill={ink.lineSoft} />
        <rect x={260} y={78} width={100} height={10} rx={5} fill={ink.lineSoft} />
      </motion.g>
      <motion.text x={305} y={135} textAnchor="middle" fill={ink.textSoft} style={{ ...sans, fontSize: 12, opacity: layers }}>
        The business rule executes below this line
      </motion.text>
      <motion.line x1={60} y1={150} x2={550} y2={150} stroke={ink.rose} strokeDasharray="4 6" style={{ pathLength: layers }} />

      <Service x={120} y={250} label="Producer" step={layers} />
      <Service x={490} y={250} label="Consumer" step={layers} />
      <motion.g style={{ opacity: layers }}>
        <rect x={225} y={226} width={160} height={48} rx={6} fill={ink.panelDeep} stroke={ink.line} />
        <text x={305} y={246} textAnchor="middle" fill={ink.mono} style={mono}>
          KAFKA TOPIC
        </text>
        <text x={305} y={264} textAnchor="middle" fill={ink.text} style={sans}>
          payments.settled
        </text>
      </motion.g>

      <motion.line x1={168} y1={250} x2={225} y2={250} stroke={ink.rose} strokeWidth={1.25} style={{ pathLength: publish }} />
      <motion.line x1={385} y1={250} x2={442} y2={250} stroke={ink.rose} strokeWidth={1.25} style={{ pathLength: consume }} />
      <motion.g style={{ x: msgX, opacity: msgOpacity }}>
        <circle cx={0} cy={250} r={7} fill={ink.rose} />
        <circle cx={0} cy={250} r={13} fill="none" stroke={ink.roseSoft} />
      </motion.g>
      <motion.text x={196} y={236} textAnchor="middle" fill={ink.rose} style={{ ...mono, opacity: publishedLabel }}>
        PUBLISHED
      </motion.text>
      <motion.text x={413} y={236} textAnchor="middle" fill={ink.rose} style={{ ...mono, opacity: consumedLabel }}>
        CONSUMED
      </motion.text>

      <motion.g style={{ opacity: verify, y: verifyY }}>
        <rect x={395} y={300} width={190} height={58} rx={8} fill={ink.panelDeep} stroke={ink.rose} />
        <text x={410} y={322} fill={ink.rose} style={mono}>
          STATE
        </text>
        <text x={410} y={342} fill={ink.text} style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
          status: SETTLED ✓
        </text>
      </motion.g>
      <motion.line x1={490} y1={274} x2={490} y2={300} stroke={ink.rose} style={{ pathLength: verify }} />

      <motion.g style={{ opacity: trace }}>
        <rect x={60} y={392} width={490} height={76} rx={10} fill={ink.panel} stroke={ink.lineSoft} />
        <text x={80} y={416} fill={ink.mono} style={mono}>
          SPLUNK · DYNATRACE
        </text>
        <text x={540} y={416} textAnchor="end" fill={ink.textSoft} style={{ ...sans, fontSize: 11 }}>
          correlationId 7f3a…
        </text>
      </motion.g>
      {[0, 1, 2].map((i) => (
        <TraceBar key={i} i={i} trace={trace} />
      ))}
    </svg>
  );
}

function Service({ x, y, label, step }: { x: number; y: number; label: string; step: MotionValue<number> }) {
  return (
    <motion.g style={{ opacity: step }}>
      <rect x={x - 48} y={y - 26} width={96} height={52} rx={8} fill={ink.panel} stroke={ink.line} />
      <text x={x} y={y + 4} textAnchor="middle" fill={ink.text} style={sans} fontWeight={500}>
        {label}
      </text>
    </motion.g>
  );
}

function TraceBar({ i, trace }: { i: number; trace: MotionValue<number> }) {
  const x = 80 + i * 150;
  const scaleX = useTransform(trace, [0.2 + i * 0.2, 0.6 + i * 0.2], [0, 1], { clamp: true });
  return <motion.rect x={x} y={434} width={130} height={14} rx={4} fill={i === 2 ? ink.rose : ink.lineSoft} style={{ scaleX, transformOrigin: `${x}px 0px` }} />;
}

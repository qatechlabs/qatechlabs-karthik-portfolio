"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { ink, mono, sans, useLerp, useStep, type SceneProps } from "../scene-utils";

const countries = ["UK", "DE", "FR", "IN", "US", "SG", "AU", "BR", "JP", "CA", "ZA", "NL"];
const tenants = ["Sandbox", "Preview", "Production-like"];
const browsers = ["Chromium", "Firefox", "WebKit"];
const cols = 4;
const cell = { w: 64, h: 44, gap: 10 };
const gridX = 250;
const gridY = 92;

/**
 * Scene 2: one test, written once, fanned out across countries, tenants, and
 * browsers by configuration. Country codes are illustrative.
 */
export function FrameworkScene({ progress }: SceneProps) {
  const test = useStep(progress, 0.02, 0.18);
  const fan = useStep(progress, 0.18, 0.5);
  const tenantStep = useStep(progress, 0.5, 0.7);
  const run = useStep(progress, 0.7, 1);
  const testX = useLerp(test, 40, 0);
  const runLabel = useStep(run, 0.7, 1);

  return (
    <svg viewBox="0 0 610 500" className="h-full w-full" role="img" aria-label="One test fanned out across countries, tenants, and browsers">
      {tenants.map((tenant, i) => (
        <TenantLayer key={tenant} label={tenant} i={i} step={tenantStep} />
      ))}
      <motion.text x={gridX + cols * (cell.w + cell.gap) - 6} y={gridY - 46} textAnchor="end" fill={ink.mono} style={{ ...mono, opacity: tenantStep }}>
        TENANTS · {tenants.map((t) => t.toUpperCase()).join(" · ")}
      </motion.text>
      {countries.map((country, i) => (
        <CountryCell key={country} label={country} i={i} fan={fan} run={run} />
      ))}
      {[0, 1, 2].map((row) => (
        <FanPath key={row} row={row} fan={fan} />
      ))}

      <motion.g style={{ opacity: test, x: testX }}>
        <rect x={30} y={212} width={120} height={76} rx={10} fill={ink.panelDeep} stroke={ink.rose} strokeWidth={1.25} />
        <text x={44} y={236} fill={ink.rose} style={mono}>
          TEST
        </text>
        <text x={44} y={258} fill={ink.text} style={sans} fontWeight={500}>
          hire an employee
        </text>
        <text x={44} y={276} fill={ink.textSoft} style={{ ...sans, fontSize: 11 }}>
          written once
        </text>
      </motion.g>

      {browsers.map((browser, i) => (
        <BrowserLane key={browser} label={browser} i={i} run={run} />
      ))}
      <motion.text x={413} y={470} textAnchor="middle" fill={ink.rose} style={{ ...mono, opacity: runLabel }}>
        EVERY COUNTRY · EVERY TENANT · IN PARALLEL
      </motion.text>
    </svg>
  );
}

function TenantLayer({ i, step }: { label: string; i: number; step: MotionValue<number> }) {
  const offset = (tenants.length - 1 - i) * 12;
  const o = useTransform(step, [i * 0.25, 0.5 + i * 0.25], [0, 1], { clamp: true });
  const x = useLerp(o, 24, 0);
  return (
    <motion.g style={{ opacity: o, x }}>
      <rect x={gridX - 14 + offset} y={gridY - 14 - offset} width={cols * (cell.w + cell.gap) + 18} height={3 * (cell.h + cell.gap) + 18} rx={14} fill={ink.panelDeep} stroke={ink.lineSoft} />
    </motion.g>
  );
}

function CountryCell({ label, i, fan, run }: { label: string; i: number; fan: MotionValue<number>; run: MotionValue<number> }) {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = gridX + col * (cell.w + cell.gap);
  const y = gridY + row * (cell.h + cell.gap);
  const o = useTransform(fan, [i * 0.06, 0.3 + i * 0.06], [0, 1], { clamp: true });
  const scale = useLerp(o, 0.85, 1);
  const bar = useTransform(run, [i * 0.05, 0.4 + i * 0.05], [0, 1], { clamp: true });
  return (
    <motion.g style={{ opacity: o, scale, transformOrigin: `${x + cell.w / 2}px ${y + cell.h / 2}px` }}>
      <rect x={x} y={y} width={cell.w} height={cell.h} rx={8} fill={ink.panel} stroke={ink.lineSoft} />
      <text x={x + 10} y={y + 18} fill={ink.text} style={sans} fontWeight={500}>
        {label}
      </text>
      <motion.rect x={x + 10} y={y + 28} width={44} height={3} rx={1.5} fill={ink.rose} style={{ scaleX: bar, transformOrigin: `${x + 10}px ${y + 29}px` }} />
    </motion.g>
  );
}

function FanPath({ row, fan }: { row: number; fan: MotionValue<number> }) {
  const y = gridY + row * (cell.h + cell.gap) + cell.h / 2;
  const pathLength = useTransform(fan, [row * 0.1, 0.5 + row * 0.1], [0, 1], { clamp: true });
  return <motion.path d={`M 150 250 C 200 250, 200 ${y}, ${gridX - 2} ${y}`} fill="none" stroke={ink.rose} strokeWidth={1.25} style={{ pathLength }} />;
}

function BrowserLane({ label, i, run }: { label: string; i: number; run: MotionValue<number> }) {
  const y = 348 + i * 38;
  const fill = useTransform(run, [0.1 + i * 0.12, 0.75 + i * 0.12], [0, 1], { clamp: true });
  return (
    <g>
      <motion.text x={250} y={y + 4} fill={ink.mono} style={{ ...mono, opacity: run }}>
        {label.toUpperCase()}
      </motion.text>
      <motion.rect x={340} y={y - 4} width={236} height={8} rx={4} fill={ink.panel} style={{ opacity: run }} />
      <motion.rect x={340} y={y - 4} width={236} height={8} rx={4} fill={ink.rose} style={{ scaleX: fill, transformOrigin: "340px 0px" }} />
    </g>
  );
}

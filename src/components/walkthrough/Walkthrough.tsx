"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import type { WalkthroughScene } from "@/content/walkthrough";
import { ArrowRight } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { SceneProps } from "./scene-utils";
import { AiScene } from "./scenes/AiScene";
import { BeneathScene } from "./scenes/BeneathScene";
import { FrameworkScene } from "./scenes/FrameworkScene";
import { GatesScene } from "./scenes/GatesScene";
import { RiskScene } from "./scenes/RiskScene";
import { StackScene } from "./scenes/StackScene";
import { guide } from "@/content/guide";
import { setNarrating, speak, useGuide } from "@/components/guide/guide-store";

const diagrams: Record<WalkthroughScene["id"], ComponentType<SceneProps>> = {
  stack: StackScene,
  risk: RiskScene,
  framework: FrameworkScene,
  beneath: BeneathScene,
  gates: GatesScene,
  ai: AiScene,
};

/** Scroll distance per scene, in viewport heights. */
const SCENE_VH = 1.5;
/** Seconds per scene when the walkthrough is played. */
const PLAY_SECONDS = 9;
/** Seconds per scene when the guide is also narrating. */
const PLAY_SECONDS_NARRATED = 14;

/**
 * A guided, narrated walkthrough. The stage stays pinned while the visitor
 * moves through it; each scene's diagram builds in step with their position,
 * so it reads as an explanation rather than a decoration. "Play" advances it
 * automatically; the dots and arrow keys jump between scenes.
 */
export function Walkthrough({ scenes }: { scenes: WalkthroughScene[] }) {
  const reduce = useReducedMotion();
  if (reduce) return <StaticWalkthrough scenes={scenes} />;
  return <ScrollWalkthrough scenes={scenes} />;
}

function ScrollWalkthrough({ scenes }: { scenes: WalkthroughScene[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = scenes.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<number | null>(null);
  const { narrating } = useGuide();

  // When the visitor asked for narration, the guide speaks each scene as it arrives.
  useEffect(() => {
    if (!narrating) return;
    void speak(scenes[index].spoken);
  }, [index, narrating, scenes]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setIndex(Math.min(count - 1, Math.max(0, Math.floor(p * count + 0.0001))));
  });

  const sceneTop = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el) return 0;
      const total = el.offsetHeight - window.innerHeight;
      return el.offsetTop + (total * i) / count + 2;
    },
    [count],
  );

  const stopPlaying = useCallback(() => {
    if (playRef.current) cancelAnimationFrame(playRef.current);
    playRef.current = null;
    setPlaying(false);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      stopPlaying();
      window.scrollTo({ top: sceneTop(Math.min(count - 1, Math.max(0, i))), behavior: "smooth" });
    },
    [count, sceneTop, stopPlaying],
  );

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = index >= count - 1 ? sceneTop(0) : window.scrollY;
    const end = el.offsetTop + el.offsetHeight - window.innerHeight;
    const distance = end - start;
    const seconds = narrating ? PLAY_SECONDS_NARRATED : PLAY_SECONDS;
    const duration = (distance / ((el.offsetHeight - window.innerHeight) / count)) * seconds * 1000;
    const t0 = performance.now();
    setPlaying(true);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      window.scrollTo(0, start + distance * t);
      if (t < 1) playRef.current = requestAnimationFrame(tick);
      else stopPlaying();
    };
    window.scrollTo(0, start);
    playRef.current = requestAnimationFrame(tick);
  }, [count, index, narrating, sceneTop, stopPlaying]);

  // Any manual input hands control back to the visitor.
  useEffect(() => {
    if (!playing) return;
    const cancel = () => stopPlaying();
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [playing, stopPlaying]);

  useEffect(() => () => stopPlaying(), [stopPlaying]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <section
      ref={ref}
      aria-labelledby="walkthrough-title"
      data-testid="walkthrough"
      data-scene={scenes[index].id}
      style={{ height: `${count * SCENE_VH * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden border-y border-paper-100/[0.07] bg-navy-950">
        <div aria-hidden="true" className="bg-blueprint absolute inset-0 opacity-50" />
        <Container className="relative flex flex-1 flex-col pt-20 pb-6 sm:pt-24 lg:pb-10">
          <div className="flex items-center justify-between gap-4">
            <h2 id="walkthrough-title" className="font-mono text-[0.7rem] tracking-[0.22em] text-rose-400 uppercase">
              How I build release confidence
            </h2>
            <div className="flex items-center gap-2">
              <VoiceButton narrating={narrating} onClick={() => setNarrating(!narrating)} />
              <PlayButton playing={playing} onClick={playing ? stopPlaying : play} />
            </div>
          </div>

          <div
            className="mt-4 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-1 lg:items-center lg:gap-14"
            tabIndex={0}
            role="group"
            aria-roledescription="walkthrough"
            aria-label={`Scene ${index + 1} of ${count}: ${scenes[index].title}`}
            onKeyDown={onKeyDown}
          >
            <div className="relative order-1 min-h-0 lg:order-2">
              <Stage scenes={scenes} progress={smooth} index={index} />
            </div>
            <div className="order-2 lg:order-1">
              <Narration scene={scenes[index]} index={index} count={count} progress={smooth} />
            </div>
          </div>

          <Dots scenes={scenes} index={index} onSelect={goTo} progress={smooth} />
        </Container>
      </div>
    </section>
  );
}

function Stage({ scenes, progress, index }: { scenes: WalkthroughScene[]; progress: MotionValue<number>; index: number }) {
  const count = scenes.length;
  return (
    <div className="relative mx-auto aspect-[61/50] max-h-[40dvh] w-full max-w-[36rem] lg:max-h-none">
      {scenes.map((scene, i) => (
        <ScenePane key={scene.id} scene={scene} i={i} count={count} progress={progress} active={i === index} />
      ))}
    </div>
  );
}

function ScenePane({ scene, i, count, progress, active }: { scene: WalkthroughScene; i: number; count: number; progress: MotionValue<number>; active: boolean }) {
  const local = useTransform(progress, [i / count, (i + 1) / count], [0, 1], { clamp: true });
  const Diagram = diagrams[scene.id];
  return (
    <motion.div
      className="absolute inset-0"
      data-scene-pane={scene.id}
      aria-hidden={!active}
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.985 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <Diagram progress={local} />
    </motion.div>
  );
}

function Narration({ scene, index, count, progress }: { scene: WalkthroughScene; index: number; count: number; progress: MotionValue<number> }) {
  const local = useTransform(progress, [index / count, (index + 1) / count], [0, 1], { clamp: true });
  const [beat, setBeat] = useState(0);
  useMotionValueEvent(local, "change", (p) => setBeat(Math.min(scene.beats.length, Math.floor(p * (scene.beats.length + 0.6)))));

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          data-testid="walkthrough-narration"
        >
          <p className="font-mono text-[0.7rem] tracking-[0.18em] text-mist-400 uppercase">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · {scene.kicker}
          </p>
          <h3 className="mt-3 font-display text-[1.6rem] leading-[1.15] text-paper-50 sm:text-[2rem] lg:text-[2.35rem]">{scene.title}</h3>
          <div className="mt-4 hidden space-y-3 text-[0.95rem] leading-relaxed text-mist-300 sm:block lg:text-base">
            {scene.narration.map((paragraph) => (
              <p key={paragraph.slice(0, 20)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-mist-300 sm:hidden">{scene.narration[0]}</p>
        </motion.div>
      </AnimatePresence>

      <ol className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Steps in this scene">
        {scene.beats.map((label, i) => {
          const done = i < beat;
          return (
            <li key={label} className={cn("flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.08em] transition-colors duration-500", done ? "text-rose-300" : "text-mist-400")}>
              <span className={cn("size-1.5 rounded-full transition-colors duration-500", done ? "bg-rose-400" : "bg-mist-500/50")} aria-hidden="true" />
              {label}
            </li>
          );
        })}
      </ol>

      {scene.link ? (
        <Link href={scene.link.href} className="mt-5 inline-flex items-center gap-2 text-sm text-rose-300 hover:text-rose-200" data-testid="walkthrough-link">
          {scene.link.label} <ArrowRight />
        </Link>
      ) : null}
    </div>
  );
}

function Dots({ scenes, index, onSelect, progress }: { scenes: WalkthroughScene[]; index: number; onSelect: (i: number) => void; progress: MotionValue<number> }) {
  const count = scenes.length;
  return (
    <nav aria-label="Walkthrough scenes" className="mt-5 flex items-center gap-3">
      <ol className="flex flex-1 items-center gap-2">
        {scenes.map((scene, i) => (
          <li key={scene.id} className="flex-1">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={i === index ? "step" : undefined}
              aria-label={`Scene ${i + 1}: ${scene.kicker}`}
              className="group relative block h-6 w-full"
            >
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper-100/15" />
              <SegmentFill i={i} count={count} progress={progress} />
            </button>
          </li>
        ))}
      </ol>
      <span className="font-mono text-[0.7rem] tracking-[0.18em] text-mist-400 uppercase">
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
    </nav>
  );
}

function SegmentFill({ i, count, progress }: { i: number; count: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [i / count, (i + 1) / count], [0, 1], { clamp: true });
  return <motion.span className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-rose-400" style={{ scaleX }} />;
}

function PlayButton({ playing, onClick }: { playing: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="walkthrough-play"
      aria-pressed={playing}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper-100/15 px-4 text-sm text-paper-50 transition-colors hover:border-rose-400/60"
    >
      <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 fill-current">
        {playing ? <path d="M2 1h3v10H2zM7 1h3v10H7z" /> : <path d="M2.5 1.5v9l7.5-4.5z" />}
      </svg>
      {playing ? "Pause" : "Play the walkthrough"}
    </button>
  );
}

function VoiceButton({ narrating, onClick }: { narrating: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="walkthrough-voice"
      aria-pressed={narrating}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
        narrating ? "border-rose-400 text-rose-200" : "border-paper-100/15 text-paper-50 hover:border-rose-400/60",
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 6v4h3l4 3V3L5 6H2z" strokeLinejoin="round" />
        {narrating ? <path d="M11 5.5a3.5 3.5 0 0 1 0 5M13 3.5a6 6 0 0 1 0 9" strokeLinecap="round" /> : <path d="M11 6l3 4M14 6l-3 4" strokeLinecap="round" />}
      </svg>
      <span className="hidden sm:inline">{narrating ? guide.prompts.narrateOff : guide.prompts.narrateOn}</span>
      <span className="sm:hidden">{narrating ? "Voice on" : "Voice off"}</span>
    </button>
  );
}

/** Reduced motion: every scene laid out in sequence, diagrams in their final state. */
function StaticWalkthrough({ scenes }: { scenes: WalkthroughScene[] }) {
  const done = useMotionValue(1);
  const list = useMemo(() => scenes, [scenes]);
  return (
    <section aria-labelledby="walkthrough-title" data-testid="walkthrough" className="border-y border-paper-100/[0.07] bg-navy-950 py-20">
      <Container>
        <h2 id="walkthrough-title" className="font-mono text-[0.7rem] tracking-[0.22em] text-rose-400 uppercase">
          How I build release confidence
        </h2>
        <ol className="mt-10 space-y-20">
          {list.map((scene, index) => {
            const Diagram = diagrams[scene.id];
            return (
              <li key={scene.id} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
                <div>
                  <p className="font-mono text-[0.7rem] tracking-[0.18em] text-mist-400 uppercase">
                    {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")} · {scene.kicker}
                  </p>
                  <h3 className="mt-3 font-display text-[2rem] leading-[1.15] text-paper-50">{scene.title}</h3>
                  <div className="mt-4 space-y-3 leading-relaxed text-mist-300">
                    {scene.narration.map((paragraph) => (
                      <p key={paragraph.slice(0, 20)}>{paragraph}</p>
                    ))}
                  </div>
                  {scene.link ? (
                    <Link href={scene.link.href} className="mt-5 inline-flex items-center gap-2 text-sm text-rose-300 hover:text-rose-200">
                      {scene.link.label} <ArrowRight />
                    </Link>
                  ) : null}
                </div>
                <div className="mx-auto aspect-[61/50] w-full max-w-[36rem]">
                  <Diagram progress={done} />
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

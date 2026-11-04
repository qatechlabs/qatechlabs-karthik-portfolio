"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { hero } from "@/content/hero";
import { isPending, site } from "@/content";
import { IntroButton } from "@/components/guide/IntroButton";
import { ArrowRight, ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import { PortraitSequence } from "./PortraitSequence";

/** Scroll distance per headline, in viewport heights. */
const HEADLINE_VH = 1;

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The opening of the site, modelled on a cinematic scroll hero: the page
 * pins, the portrait turns a full circle under the visitor's scroll, and the
 * headline moves through Karthik's roles as it does. Scrolling scrubs the
 * timeline; nothing plays on its own.
 */
export function ScrollHero({ resume }: { resume: { href: string; download: boolean } }) {
  const reduce = useReducedMotion();
  if (reduce) return <StaticHero resume={resume} />;
  return <PinnedHero resume={resume} />;
}

function PinnedHero({ resume }: { resume: { href: string; download: boolean } }) {
  const ref = useRef<HTMLElement>(null);
  const count = hero.headlines.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.5 });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const [index, setIndex] = useState(0);

  const indexFor = (p: number) => Math.min(count - 1, Math.max(0, Math.floor(p * count + 0.0001)));
  useMotionValueEvent(scrollYProgress, "change", (p) => setIndex(indexFor(p)));

  // A page restored mid-scroll (reload, back navigation) starts on the right headline.
  useEffect(() => {
    const id = requestAnimationFrame(() => setIndex(indexFor(scrollYProgress.get())));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headline = hero.headlines[index];

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      data-testid="hero"
      data-headline={index}
      className="relative -mt-16 sm:-mt-[4.5rem]"
      style={{ height: `${(count + 1) * HEADLINE_VH * 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <Stage progress={smooth}>
          <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] px-5 pt-[5.5rem] pb-5 sm:px-8 sm:pt-28 sm:pb-8 lg:px-12">
            <div className="relative flex items-start justify-between gap-6">
              <p className="font-mono text-[0.68rem] tracking-[0.22em] text-mist-300 uppercase">
                {hero.greeting}
              </p>
              <motion.p
                style={{ opacity: cueOpacity }}
                className="absolute left-1/2 top-0 hidden -translate-x-1/2 items-center gap-3 font-mono text-[0.65rem] tracking-[0.22em] whitespace-nowrap text-mist-400 uppercase lg:flex"
                aria-hidden="true"
              >
                <span className="relative block h-8 w-px overflow-hidden bg-paper-100/15">
                  <span className="hero-cue absolute inset-x-0 top-0 h-3 bg-rose-400" />
                </span>
                {hero.scrollCue}
              </motion.p>
              <p className="font-mono text-[0.68rem] tracking-[0.22em] text-mist-400 uppercase tabular-nums" aria-hidden="true">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </p>
            </div>

            <div className="grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,38rem)_1fr] lg:items-center">
              <h1 id="hero-title" className="font-display text-[clamp(2.6rem,1.4rem+6vw,6.5rem)] leading-[0.94] font-normal tracking-tight text-paper-50 lg:self-end">
                <span className="sr-only">
                  {site.name}, {hero.headlines.map((h) => h.lines.join(" ")).join(", ")}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={index}
                    aria-hidden="true"
                    data-testid="hero-headline"
                    className="block"
                    initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                    transition={{ duration: 0.55, ease }}
                  >
                    {headline.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </motion.span>
                </AnimatePresence>
              </h1>

              <div className="hidden lg:block" />

              <div className="max-w-xs lg:justify-self-end lg:self-end lg:text-right">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={index}
                    data-testid="hero-note"
                    className="text-[0.95rem] leading-relaxed text-mist-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease }}
                  >
                    {headline.note}
                  </motion.p>
                </AnimatePresence>
                <div className="hidden lg:block">
                  <p className="mt-5 font-mono text-[0.65rem] tracking-[0.2em] text-rose-400 uppercase">{hero.aside.kicker}</p>
                  <p className="mt-1 text-sm text-paper-100">{hero.aside.text}</p>
                  <p className="text-sm text-mist-400">{hero.aside.detail}</p>
                </div>
              </div>
            </div>

            <Actions resume={resume} className="pr-40 sm:pr-0" />
          </div>
        </Stage>
      </div>
    </section>
  );
}

function Stage({ progress, children }: { progress: MotionValue<number>; children: React.ReactNode }) {
  const placeholder = hero.portrait.frames === 0 || isPending(hero.portrait.source);
  return (
    <div className="relative h-full w-full bg-navy-950">
      {/* Key light behind the portrait */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 58% at 50% 58%, rgba(242,220,207,0.16), rgba(242,220,207,0.05) 45%, transparent 72%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(61,16,32,0.55), transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 top-[6%] bottom-0 mx-auto aspect-[3/4] max-h-[94%] w-auto max-w-full">
        <PortraitSequence progress={progress} sequence={hero.portrait} className="h-full w-full" />
        {placeholder ? (
          <p
            data-testid="portrait-placeholder"
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full border border-dashed border-rose-400/40 bg-navy-950/70 px-3 py-1 font-mono text-[0.6rem] tracking-[0.18em] whitespace-nowrap text-rose-300 uppercase"
          >
            Portrait sequence · placeholder
          </p>
        ) : null}
      </div>
      {/* Vignette so the text stays readable over the light */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,15,29,0.85),transparent_38%,transparent_62%,rgba(8,15,29,0.8))]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />
      {children}
    </div>
  );
}

function Actions({ resume, className }: { resume: { href: string; download: boolean }; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <ButtonLink href="/case-studies" testId="cta-explore">
        Explore my work <ArrowRight />
      </ButtonLink>
      <IntroButton />
      <ButtonLink href={site.links.github.href} variant="secondary" testId="cta-github">
        View GitHub
      </ButtonLink>
      <ButtonLink href={resume.href} download={resume.download} variant="secondary" testId="cta-resume">
        Download résumé
      </ButtonLink>
      <ButtonLink href="/contact" variant="ghost" className="ml-1" testId="cta-contact">
        Get in touch
      </ButtonLink>
    </div>
  );
}

/** Reduced motion: the first frame and first headline, with no pinning. */
function StaticHero({ resume }: { resume: { href: string; download: boolean } }) {
  const still = useMotionValue(0);
  const headline = hero.headlines[0];
  return (
    <section aria-labelledby="hero-title" data-testid="hero" data-headline={0} className="relative -mt-16 sm:-mt-[4.5rem]">
      <div className="relative h-svh min-h-[40rem] overflow-hidden">
        <Stage progress={still}>
          <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] px-5 pt-[5.5rem] pb-5 sm:px-8 sm:pt-28 sm:pb-8 lg:px-12">
            <p className="font-mono text-[0.68rem] tracking-[0.22em] text-mist-300 uppercase">{hero.greeting}</p>
            <div className="grid items-end gap-6 lg:grid-cols-[1fr_minmax(0,38rem)_1fr] lg:items-center">
              <h1 id="hero-title" className="font-display text-[clamp(2.6rem,1.4rem+6vw,6.5rem)] leading-[0.94] font-normal tracking-tight text-paper-50 lg:self-end">
                {headline.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <div className="hidden lg:block" />
              <div className="max-w-xs lg:justify-self-end lg:self-end lg:text-right">
                <p className="text-[0.95rem] leading-relaxed text-mist-300">{headline.note}</p>
                <div className="hidden lg:block">
                  <p className="mt-5 font-mono text-[0.65rem] tracking-[0.2em] text-rose-400 uppercase">{hero.aside.kicker}</p>
                  <p className="mt-1 text-sm text-paper-100">{hero.aside.text}</p>
                  <p className="text-sm text-mist-400">{hero.aside.detail}</p>
                </div>
              </div>
            </div>
            <Actions resume={resume} className="pr-40 sm:pr-0" />
          </div>
        </Stage>
      </div>
    </section>
  );
}

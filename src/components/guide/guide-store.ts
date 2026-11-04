"use client";

import { useSyncExternalStore } from "react";
import type { SpokenLine } from "@/content/guide";

/**
 * Tiny store for the spoken guide, shared by the Guide character, the hero
 * and the walkthrough. Speech uses the browser's speech synthesis when
 * available, recorded audio when a line provides it, and timed captions
 * otherwise, so the guide always "explains" even without sound.
 */
export type GuideState = {
  open: boolean;
  /** The visitor asked the guide to narrate the walkthrough as they scroll. */
  narrating: boolean;
  speaking: boolean;
  caption: string;
  /** 0 → 1 mouth opening, driven while speaking. */
  mouth: number;
  supported: boolean;
};

type Listener = () => void;

let state: GuideState = { open: false, narrating: false, speaking: false, caption: "", mouth: 0, supported: true };
const listeners = new Set<Listener>();
let run = 0;
let mouthTimer: number | null = null;
let audio: HTMLAudioElement | null = null;
let captionTimer: number | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function set(patch: Partial<GuideState>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useGuide(): GuideState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return null;
  return window.speechSynthesis;
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = synth()?.getVoices() ?? [];
  const english = voices.filter((v) => /^en(-|_)/i.test(v.lang));
  const score = (v: SpeechSynthesisVoice) =>
    (/natural|neural|premium|enhanced/i.test(v.name) ? 4 : 0) +
    (/google|microsoft|apple|samantha|daniel|rishi|veena/i.test(v.name) ? 2 : 0) +
    (/en-(GB|IN)/i.test(v.lang) ? 1 : 0) +
    (v.localService ? 0.5 : 0);
  return english.sort((a, b) => score(b) - score(a))[0];
}

function startMouth() {
  stopMouth();
  mouthTimer = window.setInterval(() => set({ mouth: 0.25 + Math.random() * 0.75 }), 110);
}

function stopMouth() {
  if (mouthTimer) window.clearInterval(mouthTimer);
  mouthTimer = null;
  if (state.mouth !== 0) set({ mouth: 0 });
}

/** Stops whatever is being spoken. Does not change `narrating`. */
export function stopSpeaking() {
  run += 1;
  synth()?.cancel();
  if (audio) {
    audio.pause();
    audio = null;
  }
  if (captionTimer) window.clearTimeout(captionTimer);
  captionTimer = null;
  stopMouth();
  if (state.speaking) set({ speaking: false });
}

function speakLine(line: SpokenLine, token: number): Promise<void> {
  return new Promise((resolve) => {
    if (token !== run) return resolve();
    set({ caption: line.text, speaking: true });
    startMouth();

    const finish = () => {
      stopMouth();
      resolve();
    };

    if (line.audio) {
      audio = new Audio(line.audio);
      audio.onended = finish;
      audio.onerror = finish;
      void audio.play().catch(finish);
      return;
    }

    const s = synth();
    if (s) {
      const utterance = new SpeechSynthesisUtterance(line.text);
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 0.98;
      utterance.pitch = 1;
      utterance.onend = finish;
      utterance.onerror = finish;
      // Some engines never fire onend if speech was never available; guard with a caption-length timeout.
      const words = line.text.split(/\s+/).length;
      captionTimer = window.setTimeout(finish, (words / 2.4) * 1000 + 4000);
      s.speak(utterance);
      return;
    }

    set({ supported: false });
    const words = line.text.split(/\s+/).length;
    captionTimer = window.setTimeout(finish, (words / 2.6) * 1000);
  });
}

/** Speaks lines in order, replacing anything currently being spoken. */
export async function speak(lines: SpokenLine[], options: { open?: boolean } = {}) {
  stopSpeaking();
  const token = run;
  if (options.open) set({ open: true });
  for (const line of lines) {
    if (token !== run) return;
    await speakLine(line, token);
  }
  if (token === run) set({ speaking: false });
}

export function openGuide() {
  set({ open: true });
}

export function closeGuide() {
  stopSpeaking();
  set({ open: false, narrating: false, caption: "" });
}

export function setNarrating(on: boolean) {
  if (!on) stopSpeaking();
  set({ narrating: on, open: on || state.open });
}

export function isSpeechSupported() {
  return synth() !== null;
}

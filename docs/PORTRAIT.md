# The 360° portrait

The hero turns a portrait of Karthik a full circle as the visitor scrolls. It is a
frame sequence, not a 3D model: a short video of him turning once on the spot,
cut into stills. Until the frames exist the hero draws a labelled wireframe bust.

## Recording

- Dark, plain backdrop. One soft key light slightly to the front-left, a faint rim
  light behind. Dark top, no busy patterns.
- Camera on a tripod at chest height, portrait orientation, 4K if possible.
- Sit or stand on a slowly rotating stool and turn one full circle in about ten
  seconds, starting and ending facing the camera. Keep the head still relative to
  the shoulders. Do not talk or blink more than needed.
- Keep the first and last frames as close to identical as you can; the sequence
  loops when the visitor scrolls back up.

## Producing the frames

```bash
# 96 frames, 1200 px tall, as WebP, from a trimmed 10 s clip.
scripts/portrait-frames.sh turn.mp4 96
```

The script writes `public/media/portrait-360/001.webp … 096.webp`. Then set
`frames: 96` and replace `source: pending(…)` with a short note in
`src/content/hero.ts`. Each frame should be under 60 KB; 96 frames at that size
is about 5 MB, loaded once and cached.

## What the component does

`PortraitSequence` preloads the frames, maps scroll progress `0 → 1` to frame
`1 → N`, and draws the current one on a canvas sized to the stage. With
`frames: 0` it draws the wireframe placeholder instead. Reduced motion shows the
first frame only.

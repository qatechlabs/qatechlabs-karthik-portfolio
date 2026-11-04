#!/usr/bin/env sh
# Cut a "turn once on the spot" clip into the hero's frame sequence.
# Usage: scripts/portrait-frames.sh turn.mp4 [frames] [height]
set -eu
input="${1:?clip path}"
frames="${2:-96}"
height="${3:-1200}"
out="public/media/portrait-360"
mkdir -p "$out"
rm -f "$out"/*.webp
duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$input")
fps=$(awk -v f="$frames" -v d="$duration" 'BEGIN { printf "%.6f", f / d }')
ffmpeg -v error -y -i "$input" -vf "fps=$fps,scale=-2:$height" -frames:v "$frames" -c:v libwebp -q:v 78 "$out/%03d.webp"
echo "Wrote $(ls "$out" | wc -l | tr -d ' ') frames to $out. Set frames: $frames in src/content/hero.ts."

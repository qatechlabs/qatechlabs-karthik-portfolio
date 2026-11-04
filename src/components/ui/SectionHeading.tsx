import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        id={id}
        className={cn(
          "font-display font-normal tracking-tight text-paper-50",
          Tag === "h1" ? "mt-5 text-display" : "mt-4 text-headline",
        )}
      >
        {title}
      </Tag>
      {intro ? <div className="mt-6 text-lg leading-relaxed text-mist-300">{intro}</div> : null}
    </div>
  );
}

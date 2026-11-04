"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Children, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

type Tag = "div" | "section" | "ul" | "ol" | "li" | "header";

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={item}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers its direct children into view. Each child is wrapped in an element
 * of `itemAs` (use "li" when the container is a list).
 */
export function RevealGroup({
  children,
  className,
  itemClassName,
  as = "div",
  itemAs = "div",
  stagger = 0.09,
  testId,
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  as?: Tag;
  itemAs?: Tag;
  stagger?: number;
  testId?: string;
}) {
  const reduce = useReducedMotion();
  const items = Children.toArray(children);

  if (reduce) {
    const Plain = as;
    const PlainItem = itemAs;
    return (
      <Plain className={className} data-testid={testId}>
        {items.map((child, i) => (
          <PlainItem key={i} className={itemClassName}>
            {child}
          </PlainItem>
        ))}
      </Plain>
    );
  }

  const Container = motion[as];
  const Item = motion[itemAs];
  return (
    <Container
      className={className}
      data-testid={testId}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {items.map((child, i) => (
        <Item key={i} className={itemClassName} variants={item}>
          {child}
        </Item>
      ))}
    </Container>
  );
}

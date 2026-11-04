"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/content/types";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ nav, name, role }: { nav: NavItem[]; name: string; role: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-paper-100/[0.07] bg-navy-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-navy-950/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8 lg:px-12">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Monogram />
          <span className="flex flex-col leading-tight">
            <span className="text-[0.95rem] font-medium tracking-tight text-paper-50">{name}</span>
            <span className="hidden font-mono text-[0.65rem] tracking-[0.18em] text-mist-400 uppercase sm:block">
              {role}
            </span>
            <span className="sr-only">, home</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                      active ? "text-paper-50" : "text-mist-300 hover:text-paper-50",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span aria-hidden="true" className="absolute inset-x-3.5 -bottom-px h-px bg-rose-400" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-paper-100/15 text-paper-50 lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h9" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id={menuId}
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-paper-100/[0.07] bg-navy-950 lg:hidden"
      >
        <ul className="mx-auto flex max-w-7xl flex-col px-5 py-4 sm:px-8">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-12 items-center justify-between border-b border-paper-100/[0.06] font-display text-2xl",
                    active ? "text-rose-300" : "text-paper-50",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

function Monogram() {
  return (
    <span
      aria-hidden="true"
      className="relative flex size-10 items-center justify-center rounded-full border border-rose-500/50 bg-gradient-to-br from-burgundy-800/60 to-navy-850 font-display text-base text-rose-200"
    >
      KK
    </span>
  );
}

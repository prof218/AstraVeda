"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { exploreLinks, mainNav, site } from "@/data/site";
import { services } from "@/data/services";
import { horoscopePeriods, zodiacSigns } from "@/data/horoscopes";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

type MenuId = "services" | "horoscope";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const openWithIntent = useCallback((id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(id);
  }, []);
  const closeWithDelay = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  }, []);

  const solid = scrolled || openMenu !== null;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-[background-color,border-color,backdrop-filter,padding] duration-500",
          solid
            ? "border-b border-line bg-void/75 py-3 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent py-5",
        )}
      >
        <div ref={navRef} className="container-cosmic flex items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                if (item.menu) {
                  const open = openMenu === item.menu;
                  return (
                    <li key={item.href} onMouseEnter={() => openWithIntent(item.menu!)} onMouseLeave={closeWithDelay}>
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={cn(navLinkCls, active && "text-star")}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                          {active && <ActiveDot />}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={`menu-${item.menu}`}
                          aria-label={`${item.label} menu`}
                          onClick={() => setOpenMenu(open ? null : item.menu!)}
                          className="-ml-2 rounded-full p-1.5 text-muted transition-colors hover:text-star"
                        >
                          <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />
                        </button>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={cn(navLinkCls, active && "text-star")} aria-current={active ? "page" : undefined}>
                      {item.label}
                      {active && <ActiveDot />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink href="/book-consultation" size="sm" className="hidden h-10 rounded-full bg-[linear-gradient(100deg,#8b5cf6,#a78bfa)] px-5 text-white shadow-[0_8px_24px_-8px_rgba(139,92,246,0.9)] hover:shadow-[0_10px_30px_-6px_rgba(167,139,250,1)] sm:inline-flex">
              Book Consultation
            </ButtonLink>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong bg-white/[0.04] text-star transition-colors hover:border-lavender/50 xl:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="size-5" />
            </button>
          </div>

          {/* ===== Desktop dropdown panels ===== */}
          <AnimatePresence>
            {openMenu && (
              <motion.div
                key={openMenu}
                id={`menu-${openMenu}`}
                initial={{ opacity: 0, y: -8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => openWithIntent(openMenu)}
                onMouseLeave={closeWithDelay}
                onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpenMenu(null); }}
                className="absolute inset-x-0 top-full hidden px-5 pt-3 xl:block"
              >
                <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-line bg-[#0b0819]/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(196,181,253,0.06)_inset] backdrop-blur-2xl">
                  {openMenu === "services" ? <ServicesMega /> : <HoroscopeMenu />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </header>
  );
}

const navLinkCls =
  "relative inline-flex items-center rounded-full px-3.5 py-2 text-[0.85rem] font-medium text-star/70 transition-colors duration-300 hover:text-star";

function ActiveDot() {
  return <span aria-hidden className="absolute bottom-0 left-1/2 size-1 -translate-x-1/2 rounded-full bg-lavender" />;
}

function ServicesMega() {
  return (
    <div className="grid grid-cols-[1fr_1fr_17rem] gap-0">
      <div className="col-span-2 p-7">
        <p className="eyebrow mb-4 text-[0.62rem]">Consultation Services</p>
        <ul className="grid grid-cols-2 gap-1">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-white/[0.045]">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white/[0.04] text-lavender transition-colors group-hover:border-lavender/40 group-hover:text-star">
                  <Icon name={s.icon} className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-star">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">{s.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col border-l border-line bg-white/[0.04] p-7">
        <p className="eyebrow mb-4 text-[0.62rem]">Explore</p>
        <ul className="space-y-1">
          {exploreLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-xl p-2.5 transition-colors hover:bg-white/[0.05]">
                <span className="block text-sm font-semibold text-star">{l.label}</span>
                <span className="block text-xs text-muted">{l.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-2xl border border-line bg-void/50 p-4">
          <p className="font-display text-xl leading-tight">Not sure where to begin?</p>
          <p className="mt-1 text-xs text-muted">A general consultation covers any one question.</p>
          <Link href="/book-consultation?service=general" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-lavender hover:text-star">
            Book a session <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function HoroscopeMenu() {
  return (
    <div className="grid grid-cols-[15rem_1fr]">
      <div className="border-r border-line bg-white/[0.04] p-7">
        <p className="eyebrow mb-4 text-[0.62rem]">Forecasts</p>
        <ul className="space-y-1">
          {horoscopePeriods.map((p) => (
            <li key={p.id}>
              <Link href={`/horoscope?period=${p.id}`} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-star/85 transition-colors hover:bg-white/[0.05] hover:text-star">
                {p.label} Horoscope <ArrowRight className="size-3.5 text-lavender/60" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-7">
        <p className="eyebrow mb-4 text-[0.62rem]">Choose your sign</p>
        <ul className="grid grid-cols-6 gap-2">
          {zodiacSigns.map((z) => (
            <li key={z.slug}>
              <Link href={`/horoscope/${z.slug}`} className="group flex flex-col items-center gap-1.5 rounded-2xl border border-transparent p-3 text-center transition-colors hover:border-line hover:bg-white/[0.04]">
                <span className="glyph text-2xl text-lavender transition-transform duration-500 group-hover:text-star">{z.symbol}</span>
                <span className="text-xs font-semibold text-star">{z.name}</span>
                <span className="text-[0.62rem] text-faint">{z.dates}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileNav({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const [expanded, setExpanded] = useState<MenuId | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site navigation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-void/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden border-l border-line bg-abyss"
          >
            <div className="relative flex items-center justify-between px-5 py-4">
              <Logo onClick={onClose} />
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu"
                className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-star">
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="relative flex-1 overflow-y-auto px-5 pb-6">
              <ul className="divide-y divide-line">
                {mainNav.map((item) => {
                  const active = isActive(pathname, item.href);
                  if (item.menu) {
                    const isOpen = expanded === item.menu;
                    const children =
                      item.menu === "services"
                        ? [...services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })), ...exploreLinks]
                        : [
                            ...horoscopePeriods.map((p) => ({ label: `${p.label} Horoscope`, href: `/horoscope?period=${p.id}` })),
                            ...zodiacSigns.map((z) => ({ label: `${z.symbol} ${z.name}`, href: `/horoscope/${z.slug}` })),
                          ];
                    return (
                      <li key={item.href}>
                        <div className="flex items-center justify-between">
                          <Link href={item.href} className={cn(mobileLinkCls, active && "text-lavender")}>{item.label}</Link>
                          <button type="button" onClick={() => setExpanded(isOpen ? null : item.menu!)} aria-expanded={isOpen}
                            aria-label={`Toggle ${item.label} submenu`} className="flex size-10 items-center justify-center rounded-full text-muted">
                            <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
                          </button>
                        </div>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                              className={cn("overflow-hidden", item.menu === "horoscope" && "grid grid-cols-2")}>
                              {children.map((c) => (
                                <li key={c.href}>
                                  <Link href={c.href} className="block py-2 pl-3 text-sm text-muted hover:text-star">{c.label}</Link>
                                </li>
                              ))}
                              <li className="h-3" aria-hidden />
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={cn(mobileLinkCls, active && "text-lavender")} aria-current={active ? "page" : undefined}>{item.label}</Link>
                    </li>
                  );
                })}
                {exploreLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={cn(mobileLinkCls, "text-xl", isActive(pathname, l.href) && "text-lavender")}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="relative border-t border-line p-5">
              <ButtonLink href="/book-consultation" className="w-full" onClick={onClose}>Book Consultation</ButtonLink>
              <p className="mt-3 text-center text-xs text-faint">{site.contact.phone} · {site.contact.email}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const mobileLinkCls = "block py-3.5 font-display text-2xl text-star transition-colors hover:text-lavender";

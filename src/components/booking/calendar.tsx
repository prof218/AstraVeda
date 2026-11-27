"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay,
  isSameMonth, parseISO, startOfMonth, startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BOOKING_WINDOW_DAYS, getAvailableSlots } from "@/data/booking";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Calendar({
  today, selected, onSelect,
}: { today: Date; selected: string | null; onSelect: (iso: string) => void }) {
  const [month, setMonth] = useState(() => startOfMonth(selected ? parseISO(selected) : today));
  const gridRef = useRef<HTMLDivElement>(null);
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS);
  const canPrev = isAfter(month, startOfMonth(today));
  const canNext = isBefore(endOfMonth(month), lastDay);

  const days = useMemo(
    () => eachDayOfInterval({
      start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
    }),
    [month],
  );

  const focusDate = (d: Date) => {
    if (!isSameMonth(d, month)) setMonth(startOfMonth(d));
    requestAnimationFrame(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${format(d, "yyyy-MM-dd")}"]`)?.focus();
    });
  };

  const onKey = (e: KeyboardEvent, d: Date) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
    if (delta) {
      e.preventDefault();
      focusDate(addDays(d, delta));
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white/[0.025] p-4 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <button type="button" onClick={() => setMonth(addMonths(month, -1))} disabled={!canPrev} aria-label="Previous month" className={navBtn}>
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-2xl" aria-live="polite">{format(month, "MMMM yyyy")}</p>
        <button type="button" onClick={() => setMonth(addMonths(month, 1))} disabled={!canNext} aria-label="Next month" className={navBtn}>
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center" aria-hidden>
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-2 text-[0.65rem] font-semibold text-faint">{d}</div>
        ))}
      </div>
      <div ref={gridRef} className="grid grid-cols-7 gap-1" role="group" aria-label={`Available dates in ${format(month, "MMMM yyyy")}`}>
        {days.map((d) => {
          const iso = format(d, "yyyy-MM-dd");
          const inMonth = isSameMonth(d, month);
          const slots = getAvailableSlots(d, today);
          const available = inMonth && slots.length > 0;
          const isSel = selected === iso;
          const isToday = isSameDay(d, today);
          const past = isBefore(d, addDays(today, -1)) && !isToday;
          return (
            <button
              key={iso}
              type="button"
              data-date={iso}
              aria-disabled={!available}
              tabIndex={isSel || (!selected && isToday) ? 0 : -1}
              aria-pressed={isSel}
              aria-label={`${format(d, "EEEE, d MMMM")}${available ? `, ${slots.length} slots available` : past ? ", past date" : ", unavailable"}`}
              onClick={() => available && onSelect(iso)}
              onKeyDown={(e) => onKey(e, d)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors duration-200",
                !inMonth && "invisible",
                available && !isSel && "text-star hover:bg-white/[0.07] hover:shadow-[inset_0_0_0_1px_rgba(196,181,253,0.35)]",
                !available && inMonth && "cursor-not-allowed text-faint/50 line-through decoration-faint/40",
                isSel && "bg-star font-semibold text-void",
              )}
            >
              {format(d, "d")}
              {available && !isSel && <span aria-hidden className="absolute bottom-1.5 size-1 rounded-full bg-success/80" />}
              {isToday && !isSel && <span aria-hidden className="absolute inset-0 rounded-xl ring-1 ring-lavender/40" />}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-[0.7rem] text-faint">
        <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-success/80" /> Available</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-px w-3 bg-faint" /> Unavailable / past</span>
        <span>Sundays closed · demo availability</span>
      </div>
    </div>
  );
}

const navBtn = "flex size-10 items-center justify-center rounded-full border border-line text-star transition-colors hover:border-lavender/50 disabled:cursor-not-allowed disabled:opacity-30";

"use client";

import { format, parseISO } from "date-fns";
import { motion } from "motion/react";
import { toast } from "sonner";
import { CalendarPlus, Check, Copy, Home, RotateCcw, TriangleAlert } from "lucide-react";
import type { ConfirmedBooking } from "@/types";
import { bookingServices, consultationModes, formatSlot } from "@/data/booking";
import { site } from "@/data/site";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

function buildIcs(b: ConfirmedBooking, serviceName: string, minutes: number) {
  const [y, m, d] = b.date!.split("-");
  const [hh, mm] = b.slot!.split(":").map(Number);
  const start = `${y}${m}${d}T${String(hh).padStart(2, "0")}${String(mm).padStart(2, "0")}00`;
  const endMin = hh * 60 + mm + minutes;
  const end = `${y}${m}${d}T${String(Math.floor(endMin / 60)).padStart(2, "0")}${String(endMin % 60).padStart(2, "0")}00`;
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AstraVeda//Demo//EN", "BEGIN:VEVENT",
    `UID:${b.reference}@astraveda.example`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;TZID=Asia/Kolkata:${start}`, `DTEND;TZID=Asia/Kolkata:${end}`,
    `SUMMARY:${serviceName} (DEMO — not a real appointment)`,
    `DESCRIPTION:Demo booking reference ${b.reference}. This prototype did not schedule a real consultation.`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export function Confirmation({ booking, onReset }: { booking: ConfirmedBooking; onReset: () => void }) {
  const service = bookingServices.find((s) => s.id === booking.serviceId)!;
  const mode = consultationModes.find((m) => m.id === booking.mode)!;
  const minutes = parseInt(service.duration, 10) || 45;

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(booking, service.name, minutes)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${booking.reference}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(booking.reference);
      toast.success("Reference copied");
    } catch {
      toast.error("Couldn't copy — please select it manually");
    }
  };

  const rows: [string, string][] = [
    ["Service", service.name],
    ["Mode", mode.name],
    ["Date", format(parseISO(booking.date!), "EEEE, d MMMM yyyy")],
    ["Time", `${formatSlot(booking.slot!)} IST · ${service.duration}`],
    ["Name", booking.details!.fullName],
    ["Email", booking.details!.email],
    ["Phone", booking.details!.phone],
    ["Demo fee", formatPrice(service.price)],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl"
      role="status"
      aria-live="polite"
    >
      <div className="relative overflow-hidden rounded-[20px] border border-lavender/30 bg-abyss p-7 text-center sm:p-12">
        <motion.div
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
          className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-star"
        >
          <Check className="size-9 text-void" strokeWidth={2.5} />
        </motion.div>
        <h2 className="relative mt-7 text-4xl sm:text-5xl">Demo booking created</h2>
        <p className="relative mx-auto mt-3 max-w-lg text-muted">
          Thank you, {booking.details!.fullName.split(" ")[0]}. Here is a summary of the consultation you selected.
        </p>

        <div className="relative mx-auto mt-7 inline-flex items-center gap-3 rounded-2xl border border-line bg-void/60 px-5 py-3">
          <span className="text-xs text-faint">Reference</span>
          <span className="font-mono text-base font-semibold text-star">{booking.reference}</span>
          <button type="button" onClick={copyRef} aria-label="Copy reference" className="text-lavender hover:text-star"><Copy className="size-4" /></button>
        </div>

        <dl className="relative mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line text-left sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="bg-abyss/95 px-5 py-3.5">
              <dt className="text-[0.65rem] text-faint">{k}</dt>
              <dd className="mt-0.5 break-words text-sm text-star">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="relative mt-8 flex gap-3 rounded-2xl border border-solar/30 bg-solar/[0.07] p-4 text-left text-sm text-star/85">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-solar" aria-hidden />
          <p>
            <strong className="font-semibold text-solar">This is a frontend prototype.</strong> No appointment has been sent to the astrologer,
            no payment was taken and no confirmation email will arrive. To book for real, please contact {site.contact.phone} (placeholder).
          </p>
        </div>

        <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/"><Home className="size-4" /> Return to Homepage</ButtonLink>
          <Button variant="secondary" onClick={downloadIcs}><CalendarPlus className="size-4" /> Add to calendar (.ics)</Button>
          <Button variant="secondary" onClick={onReset}><RotateCcw className="size-4" /> Book another</Button>
        </div>
      </div>
    </motion.div>
  );
}

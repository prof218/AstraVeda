# AstraVeda — Vedic Astrology & Consultation Platform

**Live demo:** https://astraveda-six.vercel.app

A premium, frontend-only website for a Vedic astrology practice: services, horoscopes, Kundli, numerology, Vastu, remedies, blog, gallery and a complete multi-step consultation booking flow.

The home page opens on a rendered night sky: a Milky Way band with dust lanes, a physically shaded Moon (Lommel–Seeliger lighting, maria, craters and ray systems) lit by a limb-darkened Sun with a slowly turning corona. All of it is computed procedurally in the browser, with no image assets.

> **Demo build.** All content (astrologer profile, statistics, prices, testimonials, horoscopes, articles, contact details) is placeholder data. Forms and bookings run entirely in the browser — nothing is sent to a server, no payment is taken and no appointment is created.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) + React 19 + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger (hero intro, scroll scenes) and Motion (component transitions)
- React Hook Form + Zod (form validation)
- date-fns (booking calendar), lucide-react (icons), sonner (toasts)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
```

Requires Node.js 20 or newer.

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero sky, stats, introduction, services, why choose us, process, horoscope preview, Kundli form, astrologer profile, pricing, testimonials, articles, final call to action |
| `/about` | Astrologer profile, background, philosophy, achievements |
| `/services`, `/services/[slug]` | Service listing and 10 service detail pages |
| `/horoscope`, `/horoscope/[sign]` | Daily / weekly / monthly / yearly horoscopes and 12 sign pages |
| `/kundli` | Birth-details form with validation and a preview result |
| `/numerology` | Life Path and name number calculators, number meanings |
| `/vastu` | Residential, commercial and office Vastu |
| `/remedies` | Gemstones, yantras, rudraksha and remedies with filters and an enquiry form |
| `/blog`, `/blog/[slug]` | Articles with search, category filters and detail pages |
| `/gallery` | Photo and video gallery with a lightbox |
| `/contact` | Contact form, details and map placeholder |
| `/book-consultation` | 6-step booking: service → mode → date & time → details → review → confirmation |
| `/privacy-policy`, `/terms` | Legal templates |

## Project structure

```
src/
  app/            routes, layouts and page metadata
  components/
    booking/      booking wizard, calendar, steps, confirmation
    cosmic/       night sky, moon & sun renderers, astrolabe, artwork
    home/         homepage sections
    layout/       header (mega menu, mobile drawer), footer, logo
    ui/           buttons, form fields, modal, accordion, icons
    …             blog, gallery, horoscope, kundli, numerology, remedies, forms
  data/           all mock content — edit these files to replace demo data
  hooks/          client hooks
  lib/            utilities, noise, celestial renderers, storage helpers
  types/          shared TypeScript types
```

## Replacing demo content

Everything editable lives in `src/data/`:

| File | Content |
| --- | --- |
| `site.ts` | Brand name, contact details, social links, navigation |
| `astrologer.ts` | Biography, expertise, achievements, statistics |
| `services.ts` | Service descriptions, benefits, FAQs |
| `booking.ts` | Booking services, demo prices, consultation modes, mock availability |
| `pricing.ts` | Pricing plans |
| `horoscopes.ts` | Zodiac signs and horoscope text |
| `testimonials.ts`, `blog.ts`, `remedies.ts`, `gallery.ts`, `numerology.ts` | Remaining content |

The astrologer portrait is an illustrated placeholder (`src/components/common/portrait.tsx`); swap it for a real photo with `next/image` when available.

## Connecting a backend later

- **Booking** — `src/components/booking/booking-wizard.tsx` (`confirm`) is where a real API call would replace the demo reference generator. Mock slot availability lives in `getAvailableSlots` in `src/data/booking.ts`.
- **Forms** — contact, newsletter and enquiry forms each have a single `onSubmit` handler ready to call an API.
- **Kundli** — the result screen shows an illustrative chart layout plus the Sun sign and Life Path number; a real chart needs an ephemeris / calculation service.
- **Persistence** — booking drafts and a few preferences are stored in `localStorage` (`src/lib/storage.ts`) for the demo only.

## Accessibility & performance

- Semantic landmarks, labelled forms, keyboard-navigable menus, tabs, calendar and dialogs
- `prefers-reduced-motion` respected throughout (static sky, no intro or rotation)
- Canvas rendering runs once per size; the animated layer pauses off-screen and in background tabs, with reduced detail on phones
- Responsive from 360px phones to wide desktops, with no horizontal scrolling
- Search indexing is disabled in `src/app/layout.tsx` (`robots`) while the site is a demo — enable it at launch

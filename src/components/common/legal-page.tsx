import { PageHero } from "./page-hero";

export function LegalPage({ title, crumb, sections }: { title: string; crumb: string; sections: { h: string; p: string }[] }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} crumbs={[{ label: crumb }]} description="Template text for the demo. Have this reviewed by a qualified professional before launch." />
      <div className="container-cosmic max-w-3xl pb-28">
        {sections.map((s) => (
          <section key={s.h} className="border-t border-line py-8">
            <h2 className="text-2xl sm:text-3xl">{s.h}</h2>
            <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
          </section>
        ))}
      </div>
    </>
  );
}

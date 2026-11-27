import { TestimonialCarousel } from "@/components/testimonials/testimonial-carousel";
import { DemoNote, SectionHeading } from "@/components/common/section";

export function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-title" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="container-cosmic relative">
        <SectionHeading id="testimonials-title" eyebrow="Testimonials" title={<>Words from <em className="text-gradient">our seekers</em></>} />
        <div data-reveal className="mt-14">
          <TestimonialCarousel />
        </div>
        <div className="mt-10 flex justify-center">
          <DemoNote>Sample testimonials for layout demonstration — not real reviews</DemoNote>
        </div>
      </div>
    </section>
  );
}

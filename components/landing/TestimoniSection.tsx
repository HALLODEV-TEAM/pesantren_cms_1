"use client";

import React, { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/MotionWrapper";
import { useTestimonialsQuery } from "@/hooks/useApiQueries";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatarUrl?: string | null;
  content?: string;
  quote?: string;
  rating: number;
}

interface TestimoniSectionProps {
  testimonials: Testimonial[];
}

export default function TestimoniSection({
  testimonials: initialTestimonials,
}: TestimoniSectionProps) {
  const { data: queried } = useTestimonialsQuery(initialTestimonials as any);
  const testimonials = (queried && queried.length > 0) ? queried : initialTestimonials;

  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const safeIndex = activeIndex < testimonials.length ? activeIndex : 0;
  const current = testimonials[safeIndex];

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const textQuote = (current as any).content || current.quote;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-amber-600 tracking-wider uppercase mb-2">
            <span className="w-6 h-0.5 bg-amber-500 rounded-full" />
            <span>KATA MEREKA</span>
            <span className="w-6 h-0.5 bg-amber-500 rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">
            Testimoni Wali Santri & Alumni
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Pengalaman nyata keluarga besar Pondok Pesantren Al-Ikhlas dalam perjalanan menuntut ilmu dan membina adab mulia.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <Quote className="absolute top-6 right-8 text-emerald-700/30 w-24 h-24 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10"
            >
              {current.avatarUrl && (
                <img
                  src={current.avatarUrl}
                  alt={current.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-amber-400/40 shrink-0"
                />
              )}

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>

                <p className="text-base md:text-lg text-emerald-50 leading-relaxed italic">
                  "{textQuote}"
                </p>

                <div>
                  <h4 className="text-lg font-bold text-white">{current.name}</h4>
                  <p className="text-sm text-emerald-300 font-medium">
                    {current.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-emerald-800/80">
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === safeIndex
                        ? "w-8 bg-amber-400"
                        : "w-2 bg-emerald-700 hover:bg-emerald-600"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  aria-label="Previous Testimonial"
                  className="w-10 h-10 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next Testimonial"
                  className="w-10 h-10 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

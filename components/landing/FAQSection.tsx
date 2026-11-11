"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { useFaqsQuery } from "@/hooks/useApiQueries";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

export default function FAQSection({ faqs: initialFaqs }: FAQSectionProps) {
  const { data: queried } = useFaqsQuery(initialFaqs as any);
  const faqs = (queried && queried.length > 0) ? queried : initialFaqs;

  const [openId, setOpenId] = useState<number | null>(faqs?.[0]?.id || null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-100 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-emerald-800 tracking-wider uppercase mb-2">
            <span className="w-6 h-0.5 bg-emerald-600 rounded-full" />
            <span>TANYA JAWAB</span>
            <span className="w-6 h-0.5 bg-emerald-600 rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Informasi lengkap seputar kehidupan pondok, kurikulum, dan proses penerimaan santri baru di Pondok Pesantren Al-Ikhlas.
          </p>
        </FadeIn>

        <StaggerContainer className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <StaggerItem key={faq.id}>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:text-emerald-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <HelpCircle
                        size={18}
                        className={isOpen ? "text-emerald-700 shrink-0" : "text-slate-400 shrink-0"}
                      />
                      <span className="text-sm sm:text-base">{faq.question}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-700" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                          <p className="whitespace-pre-line">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

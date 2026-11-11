"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Check, ArrowRight, GraduationCap } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/MotionWrapper";
import { useProgramsQuery } from "@/hooks/useApiQueries";

interface Program {
  id: number;
  name: string;
  slug: string;
  level: string;
  description: string;
  curriculum: string;
  features?: string;
  coverImage?: string;
  imageUrl?: string;
}

interface ProgramSectionProps {
  programs: Program[];
}

export default function ProgramSection({ programs: initialPrograms }: ProgramSectionProps) {
  const { data: queriedPrograms } = useProgramsQuery(initialPrograms as any);
  const programs = (queriedPrograms && queriedPrograms.length > 0) ? queriedPrograms : initialPrograms;

  if (!programs || programs.length === 0) return null;

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-emerald-800 tracking-wider uppercase mb-2">
            <span className="w-6 h-0.5 bg-emerald-600 rounded-full" />
            <span>JENJANG PENDIDIKAN</span>
            <span className="w-6 h-0.5 bg-emerald-600 rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif mb-4">
            Program Pendidikan Terpadu
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Menghadirkan jenjang pendidikan komprehensif dari usia dini hingga menengah atas yang mengintegrasikan kurikulum nasional dan nilai luhur kepesantrenan.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog) => {
            const featureList = prog.features
              ? prog.features.split("\n").filter(Boolean).slice(0, 4)
              : [];

            const imageSrc = prog.coverImage || (prog as any).imageUrl;

            return (
              <StaggerItem key={prog.id}>
                <HoverCard className="group flex flex-col h-full bg-slate-50/50 hover:bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden bg-emerald-900">
                    <img
                      src={imageSrc}
                      alt={prog.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 shadow-sm">
                        <GraduationCap size={13} />
                        {prog.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 mb-2 transition-colors">
                        {prog.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {prog.description}
                      </p>

                      {featureList.length > 0 && (
                        <div className="space-y-2 mb-6 pt-3 border-t border-slate-200/60">
                          {featureList.map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs font-medium text-slate-700"
                            >
                              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Check size={11} strokeWidth={3} />
                              </div>
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/pendidikan/${prog.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 group-hover:translate-x-1 transition-all"
                      >
                        <span>Lihat Profil & Kurikulum</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

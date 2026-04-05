import { FadeIn } from "@/components/ui/FadeIn";
import { ReactNode } from "react";

interface PageHeroProps {
  badge?: string;
  heading: ReactNode;
  subtext?: string;
  children?: ReactNode;
}

export function PageHero({ badge, heading, subtext, children }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -mt-[88px] pt-[calc(8rem+88px)] pb-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          {badge && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30 mb-6">
              {badge}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            {heading}
          </h1>
          {subtext && (
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
              {subtext}
            </p>
          )}
          {children}
        </FadeIn>
      </div>
    </section>
  );
}

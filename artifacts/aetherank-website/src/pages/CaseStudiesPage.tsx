import { Layout } from "@/components/Layout";
import { usePageContent, useCaseStudies } from "@/context/CmsContext";
import { FadeIn } from "@/components/ui/FadeIn";
import { FinalCTA } from "@/components/Sections";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

export default function CaseStudiesPage() {
  const content = usePageContent("/case-studies");
  const cases = useCaseStudies();
  const [selectedCase, setSelectedCase] = useState<typeof cases[0] | null>(null);

  return (
    <Layout>
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">{content.headline_highlight}</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.1}>
                <div
                  onClick={() => setSelectedCase(item)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 group cursor-pointer flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                    <img loading="lazy" decoding="async"
                      src={item.image}
                      alt={item.client}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-900 shadow-sm">
                      {item.industry}
                    </div>
                    <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm">
                      {item.timeline}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">{item.client}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-2xl font-black text-primary">{item.metric1}</div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{item.label1}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900">{item.metric2}</div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{item.label2}</div>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <span className="text-sm font-semibold text-primary group-hover:translate-x-2 transition-transform inline-flex items-center">
                        Read Full Story <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedCase && (
          <motion.div
            key="case-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              onClick={() => setSelectedCase(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="relative h-64 shrink-0">
                <img loading="lazy" decoding="async" src={selectedCase.image} alt={selectedCase.client} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <button
                  onClick={() => setSelectedCase(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex gap-2 mb-3">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{selectedCase.industry}</span>
                    <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">{selectedCase.timeline}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">{selectedCase.client}</h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">The Challenge</div>
                    <p className="text-slate-700">{selectedCase.challenge}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-2">The Solution</div>
                    <p className="text-slate-700">{selectedCase.solution}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Results Achieved</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-slate-900 text-white p-6 rounded-xl flex-1 text-center">
                      <div className="text-4xl font-black text-primary mb-1">{selectedCase.metric1}</div>
                      <div className="text-sm font-medium text-slate-300 uppercase tracking-wide">{selectedCase.label1}</div>
                    </div>
                    <div className="bg-slate-900 text-white p-6 rounded-xl flex-1 text-center">
                      <div className="text-4xl font-black text-white mb-1">{selectedCase.metric2}</div>
                      <div className="text-sm font-medium text-slate-300 uppercase tracking-wide">{selectedCase.label2}</div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-slate-100">
                  <p className="text-slate-600 mb-4">Want similar results for your business?</p>
                  <Link href="/free-audit" className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Get Your Free Audit <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FinalCTA />
    </Layout>
  );
}

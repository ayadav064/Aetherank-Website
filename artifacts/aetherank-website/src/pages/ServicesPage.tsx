import { Layout } from "@/components/Layout";
import { usePageContent } from "@/context/CmsContext";
import { FadeIn } from "@/components/ui/FadeIn";
import { Services, WhyChooseUs, FinalCTA } from "@/components/Sections";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function ServicesPage() {
  const content = usePageContent("/services");
  return (
    <Layout>
      <div className="bg-slate-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {content.headline}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                {content.headline_highlight}
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              {content.subheadline}
            </p>
            <Link
              href="/free-audit"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-1"
            >
              {content.cta_text ?? "Get Your Free Audit"} <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </FadeIn>
        </div>
      </div>
      
      <Services />
      <WhyChooseUs />
      <FinalCTA />
    </Layout>
  );
}
